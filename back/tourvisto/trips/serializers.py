from rest_framework import serializers
from .models import Trip, ItineraryDay, Activity, TripImage


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["time", "description"]


class ItineraryDaySerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True)

    class Meta:
        model = ItineraryDay
        fields = ["day", "location", "activities"]


class TripImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripImage
        fields = ["image_url"]


class TripSerializer(serializers.ModelSerializer):
    itinerary = ItineraryDaySerializer(many=True)
    images = TripImageSerializer(many=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "name",
            "description",
            "estimated_price",
            "duration",
            "budget",
            "travel_style",
            "country",
            "interests",
            "group_type",
            "best_time_to_visit",
            "weather_info",
            "location",
            "itinerary",
            "images",
        ]

    def create(self, validated_data):
        itinerary_data = validated_data.pop("itinerary", [])
        images_data = validated_data.pop("images", [])
        trip = Trip.objects.create(**validated_data)

        for day_data in itinerary_data:
            activities_data = day_data.pop("activities", [])
            day = ItineraryDay.objects.create(trip=trip, **day_data)
            for activity in activities_data:
                Activity.objects.create(itinerary_day=day, **activity)

        for image_data in images_data:
            TripImage.objects.create(trip=trip, **image_data)

        return trip
