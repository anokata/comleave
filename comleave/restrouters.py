from .viewsets import PersonViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'persons', PersonViewSet)
