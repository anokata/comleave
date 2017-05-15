from .viewsets import PersonViewSet, OverworkViewSet, SummaryViewSet
from .viewsets import RequestsViewSet, DeniedViewSet, AcceptedViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'persons', PersonViewSet)
router.register(r'overs', OverworkViewSet)
router.register(r'sum', SummaryViewSet)
router.register(r'reqs', RequestsViewSet)
router.register(r'denied', DeniedViewSet)
router.register(r'accepted', AcceptedViewSet)
