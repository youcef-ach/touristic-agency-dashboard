from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator


class MyUserManager(BaseUserManager):
    def create_user(self, traveler_name, email, password, profile_pic=None):
        if not traveler_name:
            raise ValueError("Users must have a traveler_name")

        email = self.normalize_email(email) if email else None
        myuser = self.model(traveler_name=traveler_name, email=email, profile_pic=profile_pic)
        myuser.set_password(password)  
        myuser.save()
        return myuser

    def create_superuser(self, traveler_name, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(traveler_name, email, password, **extra_fields)


class user(AbstractBaseUser, PermissionsMixin):
    traveler_name = models.CharField(
        max_length=30,
        unique=True,
        validators=[UnicodeUsernameValidator()],
    )
    email = models.EmailField(unique=False, blank=True, null=True)  # ✅ email field
    profile_pic = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "traveler_name"
    REQUIRED_FIELDS = ["email"]  # ✅ Django requires this for createsuperuser

    objects = MyUserManager()

    def __str__(self):
        return self.traveler_name