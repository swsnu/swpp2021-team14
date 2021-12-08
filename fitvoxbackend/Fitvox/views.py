from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, \
    JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from .models import PersonalSetting, ExerciseDefault, ExercisePerUser, WorkoutDetail, WorkoutEntry, WorkoutSet, \
    OneRMInfo, VolumeInfo
from .utils import make_response, get_1rm, update_volume, update_one_rm, return_volumes, return_onerms, \
    check_logged_in, body_info_response
import json

# For Voice Partner
from .voice_partner import VoicePartner

@ensure_csrf_cookie
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        email = req_data['email']
        password = req_data['password']
        hardness = req_data['hardness']
        try:
            User.objects.create_user(username=username, email=email, password=password)
        except IntegrityError:
            return HttpResponseBadRequest()

        # Create Personal Setting
        created_user = User.objects.get(username=username)
        new_user_setting = PersonalSetting(user=created_user, hardness=hardness, breaktime=60)
        new_user_setting.save()

        # Create ExercisePerUser
        for exercise in ExerciseDefault.objects.all():
            new_exercise_per_user = ExercisePerUser(user=created_user, muscleType=exercise.muscleType,
                                                    exerciseType=exercise.exerciseType, name=exercise.name,
                                                    hardness=exercise.hardness, tags={'tags': exercise.tags["tags"]},
                                                    isFavorite=False, volumes={}, oneRMs={}, )
            new_exercise_per_user.save()

        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'name': user.username}, status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


@ensure_csrf_cookie
def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def psetting(request, user_id=0):
    if request.method == 'GET':
        if request.user.is_authenticated:
            if PersonalSetting.objects.filter(user=request.user).exists():
                psettingdata = PersonalSetting.objects.get(user=request.user)
                if request.user.id == psettingdata.user.id:
                    return JsonResponse(
                        {'id': psettingdata.id, 'hardness': psettingdata.hardness, 'breaktime': psettingdata.breaktime},
                        status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            if PersonalSetting.objects.filter(user=request.user).exists():
                psettingdata = PersonalSetting.objects.get(user=request.user)
                if request.user.id == psettingdata.user.id:
                    body = request.body.decode()
                    sethardness = json.loads(body)['hardness']
                    setbreak = json.loads(body)['breaktime']

                    psettingdata.hardness = sethardness
                    psettingdata.breaktime = setbreak
                    psettingdata.save()
                    response_dict = {'id': psettingdata.id, 'hardness': psettingdata.hardness,
                                     'breaktime': psettingdata.breaktime}
                    return JsonResponse(response_dict, status=200)

            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


@ensure_csrf_cookie
def is_auth(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({'name': request.user.username, 'authenticated': True}, status=200)
        else:
            return JsonResponse({'name': request.user.username, 'authenticated': False}, status=200)
    return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def exercise_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            if ExercisePerUser.objects.filter(user=request.user).exists():
                list_to_return = ExercisePerUser.objects.filter(user=request.user)
                response = []
                for entry in list_to_return:

                    oneRMs = return_onerms(entry)
                    volumes = return_volumes(entry)

                    entry_in_dict = {
                        'id': entry.id,
                        'muscleType': entry.muscleType,
                        'exerciseType': entry.exerciseType,
                        'name': entry.name,
                        'hardness': entry.hardness,
                        'tags': entry.tags,
                        'oneRms': oneRMs,
                        'volumes': volumes,
                        'isFavorite': entry.isFavorite
                    }
                    response.append(entry_in_dict)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    elif request.method == 'POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())

            muscleType = req_data['muscleType']
            exerciseType = req_data['exerciseType']
            name = req_data['name']
            hardness = req_data['hardness']
            tags = req_data['tags']
            isFavorite = req_data['isFavorite']

            new_exercise = ExercisePerUser(user=request.user, muscleType=muscleType, exerciseType=exerciseType,
                                           name=name, hardness=hardness, tags=tags,
                                           isFavorite=isFavorite)
            new_exercise.save()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            target_id = int(req_data["id"])
            target_field = req_data["target"]
            if ExercisePerUser.objects.filter(user=request.user).exists():
                list_to_return = ExercisePerUser.objects.filter(user=request.user)
                response = []
                for entry in list_to_return:
                    if target_field == "favorite":
                        isFavorite = entry.isFavorite
                        if entry.id == target_id:
                            isFavorite = not isFavorite
                            entry.isFavorite = isFavorite
                            entry.save()
                    elif target_field == "tags":
                        if entry.id == target_id:
                            entry.tags = req_data["tags"]
                            entry.save()
                    oneRMs = return_onerms(entry)
                    volumes = return_volumes(entry)

                    entry_in_dict = {
                        'id': entry.id,
                        'muscleType': entry.muscleType,
                        'exerciseType': entry.exerciseType,
                        'name': entry.name,
                        'hardness': entry.hardness,
                        'tags': entry.tags,
                        'isFavorite': entry.isFavorite,
                        'oneRms': oneRMs,
                        'volumes': volumes
                    }
                    response.append(entry_in_dict)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    return HttpResponseNotAllowed(['GET', 'POST', 'PUT'])


@ensure_csrf_cookie
@check_logged_in
def workout_detail(request, date):
    if request.method == 'GET':
        if WorkoutDetail.objects.filter(user=request.user, date=date).exists():
            workout = WorkoutDetail.objects.get(user=request.user, date=date)
            response = make_response(workout)
            return JsonResponse(response, safe=False, status=200)
        else:
            new_workout = WorkoutDetail(user=request.user, date=date)
            new_workout.save()
            return JsonResponse([], safe=False, status=200)
    elif request.method == 'PUT':
        if WorkoutDetail.objects.filter(user=request.user, date=date).exists():
            workout = WorkoutDetail.objects.get(user=request.user, date=date)
            req_data = json.loads(request.body.decode())
            bodyFat = float(req_data['bodyFat'])
            bodyWeight = float(req_data['bodyWeight'])
            skeletalMuscle = float(req_data['skeletalMuscle'])

            workout.bodyFat = bodyFat
            workout.bodyWeight = bodyWeight
            workout.skeletalMuscle = skeletalMuscle
            workout.save()

            response = body_info_response(request.user)

            return JsonResponse(response, safe=False, status=200)

    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


@ensure_csrf_cookie
def workout_entry(request, id=-1):
    if request.method == 'POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            date = int(req_data['date'])
            id = int(req_data['id'])
            if WorkoutDetail.objects.filter(user=request.user, date=date).exists():
                workout = WorkoutDetail.objects.get(user=request.user, date=date)
                if ExercisePerUser.objects.filter(id=id).exists():
                    exercise = ExercisePerUser.objects.get(id=id)
                else:
                    return HttpResponse(status=404)

                new_workout_entry = WorkoutEntry(workout=workout, exercise=exercise)
                new_workout_entry.save()

                workout = WorkoutDetail.objects.get(user=request.user, date=date)
                response = make_response(workout)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            if WorkoutEntry.objects.filter(id=id).exists():
                entry = WorkoutEntry.objects.get(id=id)
                workout_detail = entry.workout
                exercise = entry.exercise
                date = workout_detail.date

                one_rm_flag = False
                volume_flag = False
                if OneRMInfo.objects.filter(exercise=exercise, date=date).exists():
                    if OneRMInfo.objects.get(exercise=exercise, date=date).set.workout == entry:
                        one_rm_flag = True
                if VolumeInfo.objects.filter(exercise=exercise, date=date).exists():
                    if VolumeInfo.objects.get(exercise=exercise, date=date).set.workout == entry:
                        volume_flag = True
                entry.delete()

                if one_rm_flag:
                    update_one_rm(workout_detail, exercise)
                if volume_flag:
                    update_volume(workout_detail, exercise)

                response = make_response(workout_detail)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST', 'DELETE'])


@ensure_csrf_cookie
def workout_set(request, id=-1):
    if request.method == 'POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            entry_id = int(req_data['workout_entry_id'])

            if WorkoutEntry.objects.filter(id=entry_id).exists():
                entry = WorkoutEntry.objects.get(id=entry_id)

                weight = float(req_data['weight'])
                repetition = int(req_data['repetition'])
                breaktime = int(req_data['breaktime'])

                new_set = WorkoutSet(workout=entry, weight=weight, repetition=repetition, breaktime=breaktime)
                new_set.save()

                entry = WorkoutEntry.objects.get(id=entry_id)
                workout_detail = entry.workout
                date = workout_detail.date
                exercise = entry.exercise

                # Add oneRM & volume info here
                candidate_1rm = get_1rm(weight, repetition)
                if exercise.oneRM.filter(date=date).exists():
                    one_rm = exercise.oneRM.get(date=date)
                    if candidate_1rm > one_rm.oneRM:
                        one_rm.oneRM = candidate_1rm
                        one_rm.set = new_set
                        one_rm.save()
                else:
                    new_1rm = OneRMInfo(exercise=exercise, set=new_set, date=date, oneRM=candidate_1rm)
                    new_1rm.save()

                candidate_volume = weight * repetition
                if exercise.volume.filter(date=date).exists():
                    volume = exercise.volume.get(date=date)

                    if candidate_volume > volume.volume:
                        volume.volume = candidate_volume
                        volume.set = new_set
                        volume.save()
                else:
                    new_volume = VolumeInfo(exercise=exercise, set=new_set, date=date, volume=candidate_volume)
                    new_volume.save()

                response = make_response(workout_detail)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            if WorkoutSet.objects.filter(id=id).exists():
                set = WorkoutSet.objects.get(id=id)
                workout_detail = set.workout.workout

                one_rm_flag = False
                if set.oneRM.exists():
                    one_rm_flag = True

                volume_flag = False
                if set.volume.exists():
                    volume_flag = True

                set.delete()

                exercise = set.workout.exercise

                if one_rm_flag:
                    update_one_rm(workout_detail, exercise)

                if volume_flag:
                    update_volume(workout_detail, exercise)

                response = make_response(workout_detail)

                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        if request.user.is_authenticated:
            if WorkoutSet.objects.filter(id=id).exists():
                set = WorkoutSet.objects.get(id=id)
                req_data = json.loads(request.body.decode())
                weight = float(req_data['weight'])
                repetition = int(req_data['repetition'])
                breaktime = int(req_data['breaktime'])   

                set.weight = weight
                set.repetition = repetition
                set.breaktime = breaktime
                set.save()

                entry = set.workout
                workout_detail = entry.workout
                date = workout_detail.date
                exercise = entry.exercise

                candidate_1rm = get_1rm(weight, repetition)
                one_rm = exercise.oneRM.get(date=date)
                if candidate_1rm > one_rm.oneRM:
                    one_rm.oneRM = candidate_1rm
                    one_rm.set = set
                    one_rm.save()

                candidate_volume = weight * repetition
                volume = exercise.volume.get(date=date)

                if candidate_volume > volume.volume:
                    volume.volume = candidate_volume
                    volume.set = set
                    volume.save()

                response = make_response(workout_detail)

                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST', 'PUT', 'DELETE'])


@ensure_csrf_cookie
@check_logged_in
def body_info(request):
    if request.method=='GET':
        response = body_info_response(request.user)
        return JsonResponse(response, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
@check_logged_in
def voice_partner(request, id):
    if request.method == 'GET':
        date = id
        if WorkoutDetail.objects.filter(user=request.user, date=date).exists():
            workout_detail = WorkoutDetail.objects.get(user=request.user, date=date)

            voice_partner_entry_list=[]
            for entry in workout_detail.entry.all():
                if entry.voice_partner is False:
                    continue
                entry_dict = {'name': entry.exercise.name, 'sets': []}
                for (idx, set) in enumerate(entry.sets.all()):
                    entry_dict['sets'].append({'set_num': idx+1, 'repetition': set.repetition, 'breaktime': set.breaktime})

                voice_partner_entry_list.append(entry_dict)

            url_list = []
            if len(voice_partner_entry_list)!=0:
                partner = VoicePartner.get_instance()
                url_list = partner.make_wavs(voice_partner_entry_list)

            return JsonResponse(url_list, safe=False, status=200)
        else:
            return HttpResponse(status=404)
    elif request.method == 'PUT':
        if WorkoutEntry.objects.filter(id=id).exists():
            entry = WorkoutEntry.objects.get(id=id)
            changed = not entry.voice_partner
            entry.voice_partner = changed
            entry.save()

            workout_detail = entry.workout
            response = make_response(workout_detail)
            return JsonResponse(response, safe=False, status=200)
        else:
            return HttpResponse(status=404)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])
