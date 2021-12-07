from django.db import models
from django.contrib.auth.models import User


class PersonalSetting(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hardness = models.CharField(max_length=64)
    breaktime = models.IntegerField()


class ExerciseDefault(models.Model):
    muscleType = models.CharField(max_length=64)
    exerciseType = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    hardness = models.TextField()
    tags = models.JSONField(default=dict, null=True)


class ExercisePerUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    muscleType = models.CharField(max_length=64)
    exerciseType = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    hardness = models.TextField()
    tags = models.JSONField(default=dict, null=True)
    isFavorite = models.BooleanField(default=False)


class WorkoutDetail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workout_detail")
    date = models.IntegerField(default=0)
    bodyWeight = models.FloatField(default=-1.0)
    skeletalMuscle = models.FloatField(default=-1.0)
    bodyFat = models.FloatField(default=-1.0)


class WorkoutEntry(models.Model):
    workout = models.ForeignKey(WorkoutDetail, on_delete=models.CASCADE, related_name='entry')
    exercise = models.ForeignKey(ExercisePerUser, on_delete=models.CASCADE)
    voice_partner = models.BooleanField(default=False)


class WorkoutSet(models.Model):
    workout = models.ForeignKey(WorkoutEntry, on_delete=models.CASCADE, related_name='sets')
    weight = models.FloatField(default=0.0)
    repetition = models.IntegerField(default=0)
    breaktime = models.IntegerField(default=0)


class OneRMInfo(models.Model):
    exercise = models.ForeignKey(ExercisePerUser, on_delete=models.CASCADE, related_name='oneRM')
    set = models.ForeignKey(WorkoutSet, on_delete=models.CASCADE, related_name='oneRM')
    date = models.IntegerField(default=0)
    oneRM = models.FloatField(default=0.0)


class VolumeInfo(models.Model):
    exercise = models.ForeignKey(ExercisePerUser, on_delete=models.CASCADE, related_name='volume')
    set = models.ForeignKey(WorkoutSet, on_delete=models.CASCADE, related_name='volume')
    date = models.IntegerField(default=0)
    volume = models.FloatField(default=0.0)

