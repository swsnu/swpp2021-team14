from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, \
    JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from .models import PersonalSetting, ExerciseDefault, ExercisePerUser, WorkoutDetail, WorkoutEntry, Set


@csrf_exempt
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
                                                    hardness=exercise.hardness, tags={'tags':exercise.tags["tags"]},
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


@csrf_exempt
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


@csrf_exempt
def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


@csrf_exempt
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


@csrf_exempt
def is_auth(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({'name': request.user.username, 'authenticated': True}, status=200)
        else:
            return JsonResponse({'name': request.user.username, 'authenticated': False}, status=200)
    return HttpResponseNotAllowed(['GET'])


@csrf_exempt
def exercise_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            if ExercisePerUser.objects.filter(user=request.user).exists():
                list_to_return = ExercisePerUser.objects.filter(user=request.user)
                response = []
                for entry in list_to_return:
                    entry_in_dict = {
                        'id': entry.id,
                        'muscleType': entry.muscleType,
                        'exerciseType': entry.exerciseType,
                        'name': entry.name,
                        'hardness': entry.hardness,
                        'tags': entry.tags,
                        'isFavorite': entry.isFavorite,
                        'volumes': entry.volumes,
                        'oneRMs': entry.oneRMs
                    }
                    response.append(entry_in_dict)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    elif request.method =='POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())

            muscleType = req_data['muscleType']
            exerciseType = req_data['exerciseType']
            name =req_data['name']
            hardness = req_data['hardness']
            tags = req_data['tags']
            isFavorite = req_data['isFavorite']
            volumes = []
            oneRMs = []

            new_exercise = ExercisePerUser(user=request.user, muscleType=muscleType, exerciseType=exerciseType, name=name, hardness=hardness, tags=tags,
                                           isFavorite=isFavorite, volumes=volumes, oneRMs=oneRMs)
            new_exercise.save()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        if request.user.is_authenticated:

            target_id = int(request.body.decode())

            if ExercisePerUser.objects.filter(user=request.user).exists():
                list_to_return = ExercisePerUser.objects.filter(user=request.user)
                response = []
                for entry in list_to_return:
                    isFavorite =entry.isFavorite
                    if entry.id==target_id:
                        isFavorite = not isFavorite
                        entry.isFavorite = isFavorite
                        entry.save()

                    entry_in_dict = {
                        'id': entry.id,
                        'muscleType': entry.muscleType,
                        'exerciseType': entry.exerciseType,
                        'name': entry.name,
                        'hardness': entry.hardness,
                        'tags': entry.tags,
                        'isFavorite': isFavorite,
                        'volumes': entry.volumes,
                        'oneRMs': entry.oneRMs
                    }
                    response.append(entry_in_dict)
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    return HttpResponseNotAllowed(['GET', 'POST', 'PUT'])

  
@csrf_exempt
def workout_detail(request, date):
    if request.method == 'GET':
        if request.user.is_authenticated:
            if WorkoutDetail.objects.filter(user=request.user, date=date).exists():

                workout = WorkoutDetail.objects.get(user=request.user, date=date)
                response = []

                for entry in workout.entry.all():
                    sets = []
                    for set in entry.sets.all():
                        sets.append({'repititions': set.repetition, 'weight': set.weight, 'breaktime': set.breaktime})

                    response.append({'id': entry.id, 'exercise_id': entry.exercise.id, 'sets': sets})
                return JsonResponse(response, safe=False, status=200)
            else:
                new_workout = WorkoutDetail(user=request.user, date=date)
                new_workout.save()
                return JsonResponse([], safe=False, status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


@csrf_exempt
def workout_entry(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            date= int(req_data['date'])
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
                response = []
                for entry in workout.entry.all():
                    sets = []
                    for set in entry.sets.all():
                        sets.append({'repititions': set.repetition, 'weight': set.weight, 'breaktime': set.breaktime})

                    response.append({'id': entry.id, 'exercise_id': entry.exercise.id, 'sets': sets})
                return JsonResponse(response, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])
