from rest_framework import serializers
from .models import user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = [
            "id",
            "traveler_name",
            "profile_pic",
            "is_active",
            "is_superuser",
            "is_staff",
            "date_joined",
        ]
