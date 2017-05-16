"""comleave URL Configuration """

from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import login, logout

from .restrouters import router
from overwork import views

urlpatterns = [
    url(r'^accounts/login/$',  login),
    url(r'^accounts/logout/$', views.logout),
    url(r'^accounts/register/$', views.register_user),
    url(r'^overwork/', include('overwork.urls')),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest/', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    #url(r'^action/(?P<action>[0-9a-zA-Z]+)/(?P<param>[0-9a-zA-Z]+)$', views.action, name='action'),
    url(r'^accept/(?P<over_id>[0-9a-zA-Z]+)/(?P<interval>[0-9]+)$', views.accept),
    url(r'^deny/(?P<param>[0-9a-zA-Z]+)$', views.deny),
    url(r'^register/(?P<param>[0-9a-zA-Z]+)$', views.register),
    url(r'^delete/(?P<over_id>[0-9a-zA-Z]+)$', views.delete),
    url(r'^register_overwork/(?P<date>[0-9\.]+)/(?P<interval>[0-9]+)/(?P<person_id>[0-9]+)/(?P<comment>.*)/', views.register_overwork),
    url(r'^register_unwork/(?P<date>[0-9\.]+)/(?P<interval>[0-9]+)/(?P<person_id>[0-9]+)/(?P<comment>.*)/', views.register_unwork),
    url(r'^(?!ng/).*$', views.main),
    url(r'^main/', views.main),
] + static(settings.ANGULAR_URL, document_root=settings.ANGULAR_ROOT)

