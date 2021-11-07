from django.urls import path
from Fitvox import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('user/<int:user_id>/psetting/', views.psetting, name='psetting'),
]
