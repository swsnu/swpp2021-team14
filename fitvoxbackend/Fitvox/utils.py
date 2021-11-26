from .models import WorkoutEntry, WorkoutSet, WorkoutDetail, ExercisePerUser, User, PersonalSetting, OneRMInfo, VolumeInfo

def make_response(workout_detail):
    response = []
    for entry in workout_detail.entry.all():
        sets = []
        for set in entry.sets.all():
            sets.append({'id': set.id, 'repetition': set.repetition, 'weight': set.weight, 'breaktime': set.breaktime})
        response.append({'id': entry.id, 'exercise_id': entry.exercise.id, 'sets': sets})
    return response


# Calculate the 1RM based on the Epley's Equation
def get_1rm(weight, repetition):
    return weight * (1+repetition/30)


# Update 1RM & Volume when deleting the set or workout entry
def update_one_rm(workout_detail, exercise):
    candidate_1rm_set = None
    candidate_1rm = -1

    for entry in workout_detail.entry.all():
        if entry.exercise == exercise:
            for candidate_set in entry.sets.all():
                one_rm = get_1rm(candidate_set.weight, candidate_set.repetition)

                if one_rm > candidate_1rm:
                    candidate_1rm_set = candidate_set
                    candidate_1rm = one_rm

    if candidate_1rm_set is not None:
        new_one_rm = OneRMInfo(set=candidate_1rm_set, date=workout_detail.date, exercise=exercise,
                               oneRM=candidate_1rm)
        new_one_rm.save()


def update_volume(workout_detail, exercise):
    candidate_volume_set = None
    candidate_volume = -1

    for entry in workout_detail.entry.all():
        if entry.exercise == exercise:
            for candidate_set in entry.sets.all():
                volume = candidate_set.weight * candidate_set.repetition

                if volume > candidate_volume:
                    candidate_volume_set = candidate_set
                    candidate_volume = volume

    if candidate_volume_set is not None:
        new_volume = VolumeInfo(set=candidate_volume_set, date=workout_detail.date, exercise=exercise,
                                volume=candidate_volume)
        new_volume.save()


def return_onerms(entry):
    oneRMs = []
    if OneRMInfo.objects.filter(exercise=entry).exists():
        for oneRM_entry in OneRMInfo.objects.filter(exercise=entry):
            oneRMs.append({'date': oneRM_entry.date, 'value': oneRM_entry.oneRM})

    return oneRMs


def return_volumes(entry):
    volumes = []
    if VolumeInfo.objects.filter(exercise=entry).exists():
        for volume_entry in VolumeInfo.objects.filter(exercise=entry):
            volumes.append({'date': volume_entry.date, 'value': volume_entry.volume})

    return volumes
