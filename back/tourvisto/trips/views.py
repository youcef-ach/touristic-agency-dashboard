from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .serializers import TripSerializer
from .models import Trip
from rest_framework.pagination import PageNumberPagination


class TripPagination(PageNumberPagination):
    page_size = 5  # default trips per page
    page_size_query_param = "page_size"  # allow client to override ?page_size=20
    max_page_size = 50


class TripCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id

        serializer = TripSerializer(data=data)
        if serializer.is_valid():
            trip = serializer.save(user=request.user)
            return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List all trips or create a new one
class TripListCreateView(generics.ListCreateAPIView):
    queryset = (
        Trip.objects.all()
        .select_related("user")
        .prefetch_related("itinerary__activities", "images")
    )
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = TripPagination  # ✅ custom pagination

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the trip
        serializer.save(user=self.request.user)


# Get details of a single trip (with nested itinerary & activities & images)
class TripDetailView(generics.RetrieveAPIView):
    queryset = (
        Trip.objects.all()
        .select_related("user")
        .prefetch_related("itinerary__activities", "images")
    )
    serializer_class = TripSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]  # make public or adjust as needed
    lookup_field = "id"  # we’ll use /trips/<id>/
