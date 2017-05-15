"""comleave URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import login, logout

from .restrouters import router
from overwork import views

urlpatterns = [
    url(r'^accounts/login/$',  login),
    url(r'^accounts/logout/$', logout),
    url(r'^overwork/', include('overwork.urls')),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest/', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^action/(?P<action>[0-9a-zA-Z]+)/(?P<param>[0-9a-zA-Z]+)$', views.action, name='action'),
    url(r'^accept/(?P<param>[0-9a-zA-Z]+)$', views.accept),
    url(r'^deny/(?P<param>[0-9a-zA-Z]+)$', views.deny),
    url(r'^register/(?P<param>[0-9a-zA-Z]+)$', views.register),
    url(r'^delete/(?P<over_id>[0-9a-zA-Z]+)$', views.delete),
    url(r'^register_overwork/(?P<date>[0-9\.]+)/(?P<interval>[0-9]+)/(?P<person_id>[0-9]+)/(?P<comment>.*)/', views.register_overwork),
    url(r'^register_unwork/(?P<date>[0-9\.]+)/(?P<interval>[0-9]+)/(?P<person_id>[0-9]+)/(?P<comment>.*)/', views.register_unwork),
    url(r'^(?!ng/).*$', views.main),
    url(r'^main/', views.main),
] + static(settings.ANGULAR_URL, document_root=settings.ANGULAR_ROOT)

#+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
