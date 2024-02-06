from django.urls import path
from .views import generate_hashtags

urlpatterns = [
    path('generate_hashtags/', generate_hashtags, name='generate_hashtags'),
]
