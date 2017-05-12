from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    url(r'^$', views.test, name='test'),
    url(r'^person$', views.person, name='persons'),
    url(r'^action$', views.action, name='action'),
]
