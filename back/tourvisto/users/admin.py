from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import user


class CustomUserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = user

    list_display = ("traveler_name", "email", "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_superuser", "is_active")
    fieldsets = (
        (None, {"fields": ("traveler_name", "email", "password", "profile_pic")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "traveler_name",
                    "email",
                    "password1",
                    "password2",
                    "profile_pic",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
    search_fields = ("traveler_name", "email")
    ordering = ("traveler_name",)


admin.site.register(user, CustomUserAdmin)
