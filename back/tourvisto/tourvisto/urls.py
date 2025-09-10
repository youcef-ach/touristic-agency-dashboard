from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import createUserView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token


@ensure_csrf_cookie
def csrfView(request):
    token = get_token(request)
    return JsonResponse({"csrftoken": token})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/refresh/", TokenRefreshView.as_view()),
    path("users/register/", createUserView),
    path("csrf/", csrfView),
    path("registerUser/", createUserView),
]
