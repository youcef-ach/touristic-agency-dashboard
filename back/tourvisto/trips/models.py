from django.db import models
from users.models import user


class trip(models.Model):
    user = models.ForeignKey(user, on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=True, null=True)
    mainImage = models.ImageField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    payment_link = models.TextField(max_length=100, null=False, blank=False)


class tripImage(models.Model):
    image = models.ImageField(blank=False, null=False)
    parentTrip = models.ForeignKey(trip, on_delete=models.CASCADE)