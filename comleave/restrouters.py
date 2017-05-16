from .viewsets import OverworkViewSet
from .viewsets import RequestsViewSet, DeniedViewSet, AcceptedViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'overs', OverworkViewSet)
router.register(r'reqs', RequestsViewSet)
router.register(r'denied', DeniedViewSet)
router.register(r'accepted', AcceptedViewSet)
