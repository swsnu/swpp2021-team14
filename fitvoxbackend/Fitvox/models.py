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


class ExercisePerUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    muscleType = models.CharField(max_length=64)
    exerciseType = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    hardness = models.TextField()
    isFavorite = models.BooleanField()
    volumes = models.JSONField()
    oneRMs = models.JSONField()



