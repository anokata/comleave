"""comleave URL Configuration """

from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import login, logout

from overwork import views

urlpatterns = [
    url(r'^persons/$', views.persons),
    url(r'^summarize/$', views.summarize),
    url(r'^registred/$', views.registred),
    url(r'^accepted/$', views.accepted),
    url(r'^denied/$', views.denied),
    url(r'^register_user/$', views.register_new_user),
    url(r'^update/$', views.update_current_user),
    url(r'^login/$', views.login_user),
    url(r'^logout/$', views.logout_user),
    url(r'^user/$', views.get_user),
    url(r'^accept/(?P<over_id>[0-9a-zA-Z]+)/(?P<interval>[0-9]+)$', views.accept),
    url(r'^deny/(?P<param>[0-9a-zA-Z]+)$', views.deny),
    url(r'^over_by_id/(?P<id>[0-9]+)$', views.over_by_id),
    url(r'^register/(?P<param>[0-9a-zA-Z]+)$', views.register),
    url(r'^delete/(?P<over_id>[0-9a-zA-Z]+)$', views.delete),
    url(r'^register_overwork/', views.register_overwork),
    url(r'^order_edit/', views.order_edit),
    url(r'^register_unwork/', views.register_unwork),
    url(r'^overwork/', include('overwork.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^(?!ng/).*$', views.main), # Frontend must be last
] + static(settings.ANGULAR_URL, document_root=settings.ANGULAR_ROOT)

