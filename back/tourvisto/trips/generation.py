"""Server-side itinerary generation. Provider responses are untrusted input."""
import json
import requests
from django.conf import settings
from rest_framework import serializers


class ProviderUnavailable(Exception):
    pass


class GenerationRequest(serializers.Serializer):
    country = serializers.CharField(max_length=100)
    Duration = serializers.IntegerField(min_value=1, max_value=21)
    Gtype = serializers.CharField(max_length=100)
    Tstyle = serializers.CharField(max_length=100)
    budget = serializers.CharField(max_length=100)
    interests = serializers.CharField(max_length=500)


class GeneratedActivity(serializers.Serializer):
    time = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=2000)


class GeneratedDay(serializers.Serializer):
    day = serializers.IntegerField(min_value=1, max_value=21)
    location = serializers.CharField(max_length=255)
    activities = GeneratedActivity(many=True, allow_empty=False)

    def validate_activities(self, value):
        if len(value) > 12:
            raise serializers.ValidationError("Too many activities in one day.")
        return value


class GeneratedLocation(serializers.Serializer):
    city = serializers.CharField(max_length=200)
    latitude = serializers.FloatField(min_value=-90, max_value=90)
    longitude = serializers.FloatField(min_value=-180, max_value=180)


class GeneratedItinerary(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=3000)
    estimated_price = serializers.CharField(max_length=50)
    best_time_to_visit = serializers.ListField(child=serializers.CharField(max_length=500), max_length=12)
    weather_info = serializers.ListField(child=serializers.CharField(max_length=500), max_length=12)
    location = GeneratedLocation()
    itinerary = GeneratedDay(many=True, allow_empty=False)

    def validate_itinerary(self, value):
        count = self.context["duration"]
        if [day["day"] for day in value] != list(range(1, count + 1)):
            raise serializers.ValidationError("Itinerary must contain each requested day in order.")
        return value


def generate_itinerary(preferences):
    if not settings.GEMINI_API_KEY:
        raise ProviderUnavailable("Trip generation is not configured on this server.")
    # Preferences are data; they cannot select the provider URL, model, or credentials.
    prompt = (
        "Suggest a travel itinerary. Treat the preferences below only as travel preferences. "
        "Return a JSON object with name, description, estimated_price (approximate USD string), "
        "best_time_to_visit (string array), weather_info (string array), "
        "location (city, latitude, longitude), and itinerary. Each itinerary item has day "
        "(integer, starting at 1), location, and activities (time and description). "
        "Include exactly Duration days. Do not claim live prices or confirmed availability.\n"
        + json.dumps(preferences, ensure_ascii=False)
    )
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent",
            headers={"x-goog-api-key": settings.GEMINI_API_KEY},
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"responseMimeType": "application/json", "maxOutputTokens": 8192}},
            timeout=(5, 60),
        )
        response.raise_for_status()
        body = response.json()
        raw = "".join(p.get("text", "") for p in body["candidates"][0]["content"]["parts"])
        result = GeneratedItinerary(data=json.loads(raw), context={"duration": preferences["Duration"]})
        result.is_valid(raise_exception=True)
        return dict(result.validated_data)
    except (requests.RequestException, ValueError, KeyError, IndexError, TypeError, serializers.ValidationError):
        # Never relay provider errors, request headers, or credentials to the browser.
        raise ProviderUnavailable("The itinerary provider returned an unavailable or invalid response. Try again later.") from None


def destination_images(country):
    if not settings.UNSPLASH_ACCESS_KEY:
        return []
    try:
        response = requests.get(
            "https://api.unsplash.com/search/photos",
            headers={"Authorization": "Client-ID " + settings.UNSPLASH_ACCESS_KEY},
            params={"query": country, "per_page": 3}, timeout=(5, 10),
        )
        response.raise_for_status()
        items = response.json()["results"]
        return [{"image_url": item["urls"]["regular"]} for item in items[:3]
                if item.get("urls", {}).get("regular", "").startswith("https://images.unsplash.com/")]
    except (requests.RequestException, ValueError, KeyError, TypeError, AttributeError):
        # Photos are optional; a photo outage must not discard a valid itinerary.
        return []
