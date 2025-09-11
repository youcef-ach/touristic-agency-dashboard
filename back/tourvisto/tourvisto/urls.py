from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import createUserView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token
from .views import MyTokenObtainPairView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from users.views import UserListView


@ensure_csrf_cookie
def csrfView(request):
    token = get_token(request)
    return JsonResponse({"csrftoken": token})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/register/", createUserView),
    path("csrf/", csrfView),
    path("registerUser/", createUserView),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)