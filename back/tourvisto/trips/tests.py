from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from trips.models import Trip, ItineraryDay, Activity, TripImage

User = get_user_model()


class TripModelAndAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            traveler_name="test_traveler",
            email="traveler@example.com",
            password="StrongPassword123!"
        )
        # Obtain JWT token
        token_resp = self.client.post(
            "/api/token/",
            data={"traveler_name": "test_traveler", "password": "StrongPassword123!"}
        )
        self.access_token = token_resp.json()["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        # Seed sample trip
        self.trip = Trip.objects.create(
            user=self.user,
            name="Tokyo Urban & Culture",
            description="Explore Shibuya, Asakusa, and mount Fuji on a 7-day curated journey.",
            estimated_price="$2,400",
            duration=7,
            budget="Comfort",
            travel_style="Cultural & Food",
            country="Japan",
            interests='["Anime", "Culinary", "Temples"]',
            group_type="Solo",
            best_time_to_visit=["March", "April", "October"],
            weather_info=["Mild spring temperatures", "Cherry blossom bloom"],
            location={"city": "Tokyo", "latitude": 35.6762, "longitude": 139.6503}
        )

        # Seed itinerary day and activities
        self.day1 = ItineraryDay.objects.create(
            trip=self.trip,
            day=1,
            location="Shinjuku & Shibuya"
        )
        self.act1 = Activity.objects.create(
            itinerary_day=self.day1,
            time="Morning",
            description="Arrive at Haneda Airport, hotel check-in at Shinjuku."
        )
        self.act2 = Activity.objects.create(
            itinerary_day=self.day1,
            time="Afternoon",
            description="Shibuya Crossing exploration and Hachiko statue visit."
        )

        # Seed Trip Image
        self.image = TripImage.objects.create(
            trip=self.trip,
            image_url="https://images.unsplash.com/photo-tokyo-test"
        )

    def test_trip_model_str(self):
        self.assertEqual(str(self.trip), "Tokyo Urban & Culture (Japan)")
        self.assertEqual(str(self.day1), "Day 1 - Shinjuku & Shibuya")
        self.assertIn("Morning", str(self.act1))
        self.assertEqual(str(self.image), "Image for Tokyo Urban & Culture")

    def test_trip_list_authenticated(self):
        response = self.client.get("/trips/all/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("results", data)
        self.assertGreaterEqual(len(data["results"]), 1)
        trip_item = data["results"][0]
        self.assertEqual(trip_item["name"], "Tokyo Urban & Culture")
        self.assertEqual(trip_item["country"], "Japan")

    def test_trip_list_unauthenticated(self):
        unauth_client = APIClient()
        response = unauth_client.get("/trips/all/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_trip_detail_authenticated(self):
        response = self.client.get(f"/trips/tripDetails/{self.trip.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["id"], self.trip.id)
        self.assertEqual(data["country"], "Japan")
        self.assertEqual(len(data["itinerary"]), 1)
        self.assertEqual(len(data["images"]), 1)
        self.assertEqual(len(data["itinerary"][0]["activities"]), 2)

    def test_trip_detail_not_found(self):
        response = self.client.get("/trips/tripDetails/99999")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_trip_create_view(self):
        payload = {
            "name": "Paris Art & Architecture",
            "description": "Museums, historic monuments, and Seine river cruise.",
            "estimated_price": "$1,800",
            "duration": 5,
            "budget": "Mid-range",
            "travel_style": "Historical",
            "country": "France",
            "interests": '["Art", "Museums"]',
            "group_type": "Couple",
            "best_time_to_visit": ["May", "September"],
            "weather_info": ["Pleasant sunny days"],
            "location": {"city": "Paris", "latitude": 48.8566, "longitude": 2.3522},
            "itinerary": [
                {
                    "day": 1,
                    "location": "Louvre & Tuileries",
                    "activities": [{"time": "Morning", "description": "Visit Mona Lisa and Classical Antiquities"}]
                }
            ],
            "images": [
                {"image_url": "https://images.unsplash.com/photo-paris"}
            ]
        }
        response = self.client.post("/trips/create/", data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Trip.objects.filter(name="Paris Art & Architecture").exists())
        created = Trip.objects.get(name="Paris Art & Architecture")
        self.assertEqual(created.user, self.user)
