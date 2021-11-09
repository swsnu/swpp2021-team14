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



