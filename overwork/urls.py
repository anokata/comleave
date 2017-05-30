from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    url(r'^persons/$', views.persons),
    url(r'^summarize/$', views.summarize),
    url(r'^registred/$', views.registred, {'limit':0}),
    url(r'^registred/(?P<limit>[0-9]+)$', views.registred),
    url(r'^accepted/$', views.accepted, {'limit':0}),
    url(r'^accepted/(?P<limit>[0-9]+)$', views.accepted),
    url(r'^denied/$', views.denied, {'limit':0}),
    url(r'^denied/(?P<limit>[0-9]+)/(?P<offset>[0-9]+)$', views.denied),
    url(r'^register_user/$', views.register_new_user),
    url(r'^update/$', views.update_current_user),
    url(r'^login/$', views.login_user),
    url(r'^logout/$', views.logout_user),
    url(r'^user/$', views.get_user),
    url(r'^accept/(?P<over_id>[0-9a-zA-Z]+)/(?P<interval>[0-9]+)$', views.accept),
    url(r'^deny/(?P<param>[0-9a-zA-Z]+)$', views.deny),
    url(r'^register/(?P<param>[0-9a-zA-Z]+)$', views.register),
    url(r'^delete/(?P<over_id>[0-9a-zA-Z]+)$', views.delete),
    url(r'^over_by_id/(?P<id>[0-9]+)$', views.over_by_id),
    url(r'^order_edit/', views.order_edit),
    url(r'^register_overwork/', views.register_overwork),
    url(r'^register_unwork/', views.register_unwork),
    url(r'^delete_orders/', views.delete_orders),
]
