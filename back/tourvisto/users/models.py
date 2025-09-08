from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class myUserManager(BaseUserManager):

    def create_user(self, traveler_name, password, profile_pic=None):
        user = self.model(traveler_name=traveler_name, profile_pic=profile_pic)
        user.set_password(password)
        user.save()

    def create_superuser(self, traveler_name, password, profile_pic=None):
        user = self.model(traveler_name=traveler_name, profile_pic=profile_pic)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()


class myUser(AbstractBaseUser, PermissionsMixin):

    traveler_name = models.TextField(
        max_length=30, unique=True, null=False, blank=False, default="a"
    )
    profile_pic = models.ImageField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "traveler_name"

    objects = myUserManager()