from django.http import JsonResponse
from django.db import IntegrityError, DatabaseError
from .forms import userCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import user
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


@csrf_exempt
def createUserView(request):
    if request.method != "POST":
        return JsonResponse({"message": "GET not allowed"}, status=405)
    form = userCreationForm(request.POST)
    try:
        if not form.is_valid():
            return JsonResponse(
                {"message": "Validation failed", "errors": form.errors}, status=400
            )
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password"])
        user.save()
    except ValidationError as e:
        return JsonResponse(
            {"message": "Validation error", "errors": e.message_dict}, status=400
        )
    except IntegrityError as e:
        return JsonResponse({"message": "Integrity error", "error": str(e)}, status=400)
    except DatabaseError as e:
        return JsonResponse({"message": "Database error", "error": str(e)}, status=500)
    except Exception as e:
        return JsonResponse(
            {"message": "Unexpected error", "error": str(e)}, status=500
        )

    return JsonResponse({"message": "success"}, status=201)


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