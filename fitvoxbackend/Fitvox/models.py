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
    isFavorite = models.BooleanField()
    volumes = models.JSONField(default=dict, null=True)
    oneRMs = models.JSONField(default=dict, null=True)

class WorkoutDetail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.IntegerField

class WorkoutEntry(models.Model):
    workout = models.ForeignKey(WorkoutDetail, on_delete=models.CASCADE)
    exercise = models.ForeignKey(ExercisePerUser, on_delete=models.CASCADE)

class Set(models.Model):
    breaktime = models.IntegerField
    weight = models.FloatField
    repetition =models.IntegerField


