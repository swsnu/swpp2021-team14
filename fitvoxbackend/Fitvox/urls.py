from django.urls import path
from Fitvox import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('psetting/', views.psetting, name='psetting'),
    path('isAuth/', views.is_auth, name='maintain login status'),
    path('exercise_list/', views.exercise_list, name='exercise list')
]