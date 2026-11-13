import json
from unittest.mock import Mock, patch
import requests
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient
from .models import Trip
from .generation import GeneratedItinerary, ProviderUnavailable, generate_itinerary, destination_images


PREFERENCES = {"country": "Japan", "Duration": 1, "Gtype": "friends", "Tstyle": "culture",
               "budget": "moderate", "interests": "art"}
ITINERARY = {"name": "Tokyo museums", "description": "An indicative itinerary.", "estimated_price": "$100",
             "best_time_to_visit": ["Spring"], "weather_info": ["Check the forecast"],
             "location": {"city": "Tokyo", "latitude": 35.68, "longitude": 139.69},
             "itinerary": [{"day": 1, "location": "Tokyo", "activities": [{"time": "Morning", "description": "Visit a museum"}]}]}


class GenerationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(traveler_name="generation-test", email="test@example.com", password="test-password")
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    @patch("trips.views.generate_itinerary")
    def test_anonymous_request_cannot_call_provider(self, provider):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.post("/trips/generate/", PREFERENCES).status_code, 401)
        provider.assert_not_called()

    @patch("trips.views.generate_itinerary")
    def test_invalid_duration_rejected_before_provider_call(self, provider):
        response = self.client.post("/trips/generate/", {**PREFERENCES, "Duration": 1000})
        self.assertEqual(response.status_code, 400)
        provider.assert_not_called()

    @patch("trips.views.destination_images", return_value=[])
    @patch("trips.views.generate_itinerary", return_value=ITINERARY)
    def test_generated_trip_belongs_to_authenticated_user(self, provider, images):
        response = self.client.post("/trips/generate/", {**PREFERENCES, "user": 999}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Trip.objects.get().user_id, self.user.id)
        self.assertEqual(Trip.objects.get().itinerary.count(), 1)

    @patch("trips.views.generate_itinerary", side_effect=ProviderUnavailable("Generation unavailable."))
    def test_provider_failure_does_not_create_partial_trip(self, provider):
        self.assertEqual(self.client.post("/trips/generate/", PREFERENCES).status_code, 503)
        self.assertFalse(Trip.objects.exists())

    @patch("trips.views.generate_itinerary", side_effect=ProviderUnavailable("Unavailable."))
    def test_generation_rate_limit_is_applied(self, provider):
        for _ in range(6):
            self.assertEqual(self.client.post("/trips/generate/", PREFERENCES).status_code, 503)
        self.assertEqual(self.client.post("/trips/generate/", PREFERENCES).status_code, 429)
        self.assertEqual(provider.call_count, 6)

    @override_settings(GEMINI_API_KEY="test-private-key")
    @patch("trips.generation.requests.post")
    def test_provider_response_validated_and_key_only_in_header(self, post):
        post.return_value = Mock(json=lambda: {"candidates": [{"content": {"parts": [{"text": json.dumps(ITINERARY)}]}}]})
        result = generate_itinerary(PREFERENCES)
        self.assertEqual(result["name"], "Tokyo museums")
        args, kwargs = post.call_args
        self.assertNotIn("test-private-key", args[0])
        self.assertEqual(kwargs["headers"]["x-goog-api-key"], "test-private-key")
        self.assertNotIn("test-private-key", json.dumps(result))

    @override_settings(GEMINI_API_KEY="test-private-key")
    @patch("trips.generation.requests.post")
    def test_invalid_provider_payload_is_rejected(self, post):
        post.return_value = Mock(json=lambda: {"candidates": [{"content": {"parts": [{"text": '{"name":"Only a title"}'}]}}]})
        with self.assertRaises(ProviderUnavailable):
            generate_itinerary(PREFERENCES)

    @override_settings(GEMINI_API_KEY="test-private-key")
    @patch("trips.generation.requests.post", side_effect=requests.Timeout("test-private-key"))
    def test_provider_exception_does_not_echo_secret(self, post):
        with self.assertRaises(ProviderUnavailable) as raised:
            generate_itinerary(PREFERENCES)
        self.assertNotIn("test-private-key", str(raised.exception))

    def test_missing_days_are_rejected(self):
        serializer = GeneratedItinerary(data=ITINERARY, context={"duration": 2})
        self.assertFalse(serializer.is_valid())

    @override_settings(UNSPLASH_ACCESS_KEY="test-image-key")
    @patch("trips.generation.requests.get", side_effect=requests.Timeout)
    def test_image_failure_is_optional(self, get):
        self.assertEqual(destination_images("Japan"), [])

    def test_nested_write_rolls_back_when_activity_insert_fails(self):
        from .serializers import TripSerializer
        data = {**ITINERARY, "duration": 1, "country": "Japan", "budget": "moderate", "travel_style": "culture",
                "interests": "art", "group_type": "friends", "images": []}
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        with patch("trips.serializers.Activity.objects.create", side_effect=RuntimeError("write failure")):
            with self.assertRaises(RuntimeError):
                serializer.save(user=self.user)
        self.assertFalse(Trip.objects.exists())
