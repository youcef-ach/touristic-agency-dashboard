from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .models import user
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import user
import json


@csrf_exempt
def createUserView(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        traveler_name = data.get("traveler_name")
        email = data.get("email")
        password = data.get("password")

        if not traveler_name or not password:
            return JsonResponse(
                {"error": "traveler_name and password required"}, status=400
            )

        myuser = user.objects.create_user(
            traveler_name=traveler_name, email=email, password=password
        )

        return JsonResponse(
            {
                "message": "User created successfully",
                "traveler_name": myuser.traveler_name,
                "email": myuser.email,
            },
            status=201,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


class UserListPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = user.objects.all().order_by("id")
        paginator = UserListPagination()
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
