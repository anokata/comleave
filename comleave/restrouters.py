from .viewsets import PersonViewSet, OverworkViewSet, SummaryViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'persons', PersonViewSet)
router.register(r'overs', OverworkViewSet)
router.register(r'sum', SummaryViewSet)
