from django.contrib import admin
from .models import PersonalSetting, ExerciseDefault, ExercisePerUser

# Register your models here.
admin.site.register(PersonalSetting)
admin.site.register(ExerciseDefault)
admin.site.register(ExercisePerUser)
