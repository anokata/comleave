"""comleave URL Configuration """

from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from overwork import views

urlpatterns = [
    url(r'', include('overwork.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^(?!ng/).*$', views.main), # Frontend must be last
] + static(settings.ANGULAR_URL, document_root=settings.ANGULAR_ROOT)

