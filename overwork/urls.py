from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.test, name='test'),
    url(r'^persons$', views.persons, name='persons'),
]
