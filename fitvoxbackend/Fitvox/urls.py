from django.urls import path, include
from django.contrib.auth import views as auth_views
from Fitvox import views


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('psetting/', views.psetting, name='psetting'),
    path('isAuth/', views.is_auth, name='maintain login status'),
    path('exercise_list/', views.exercise_list, name='exercise list'),
    path('workout_detail/<int:date>/', views.workout_detail, name='workout detail'),
    path('workout_entry/', views.workout_entry, name='workout entry'),
    path('workout_entry/<int:id>/', views.workout_entry, name='workout entry'),
    path('workout_set/', views.workout_set, name='workout set'),
    path('workout_set/<int:id>/', views.workout_set, name='workout set'),
    path('body_info/', views.body_info, name='body info'),
    path('voice_partner/<int:id>/', views.voice_partner, name='voice partner'),
    path('wav_file/<int:id>/', views.wav_file, name='wav file'),
    path('workout_summary/', views.workout_summary, name='workout_summary'),
    path('send_email/', views.send_email, name='send_email'),
    path('password_reset/', views.UserPasswordResetView.as_view(), name="password_reset"),
    path('password_reset_done/', views.UserPasswordResetDoneView.as_view(), name="password_reset_done"),
    path('password_reset_confirm/<uidb64>/<token>/', views.UserPasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('password_reset_complete/', views.UserPasswordResetCompleteView.as_view(), name="password_reset_complete"),
]

