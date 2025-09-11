from django.db import models
from users.models import user


class Trip(models.Model):
    user = models.ForeignKey(user, on_delete=models.CASCADE, related_name="trips")
    name = models.CharField(max_length=255)
    description = models.TextField()
    estimated_price = models.CharField(max_length=50)  # store "$1200" etc.
    duration = models.PositiveIntegerField()
    budget = models.CharField(max_length=100)
    travel_style = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    interests = models.TextField()  # JSON string or comma-separated list
    group_type = models.CharField(max_length=100)
    best_time_to_visit = models.JSONField(default=list, blank=True)  # list of strings
    weather_info = models.JSONField(default=list, blank=True)  # list of strings
    location = models.JSONField(default=dict, blank=True)  # city, coords, map link
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.country})"


class ItineraryDay(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="itinerary")
    day = models.PositiveIntegerField()
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"Day {self.day} - {self.location}"


class Activity(models.Model):
    itinerary_day = models.ForeignKey(
        ItineraryDay, on_delete=models.CASCADE, related_name="activities"
    )
    time = models.CharField(max_length=50)  # "Morning", "Afternoon", "Evening"
    description = models.TextField()

    def __str__(self):
        return f"{self.time} - {self.description[:40]}..."


class TripImage(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="images")
    image_url = models.TextField(max_length=400, default="")

    def __str__(self):
        return f"Image for {self.trip.name}"