from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
import json

User = get_user_model()


class UserModelTests(TestCase):
    def test_create_user_success(self):
        user = User.objects.create_user(
            traveler_name="alice_explorer",
            email="alice@example.com",
            password="SecurePassword123!"
        )
        self.assertEqual(user.traveler_name, "alice_explorer")
        self.assertEqual(user.email, "alice@example.com")
        self.assertTrue(user.check_password("SecurePassword123!"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_missing_traveler_name(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                traveler_name="",
                email="noname@example.com",
                password="password"
            )

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            traveler_name="superadmin",
            email="admin@example.com",
            password="AdminPassword123!"
        )
        self.assertEqual(admin.traveler_name, "superadmin")
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)


class UserAuthAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            traveler_name="bob_traveler",
            email="bob@example.com",
            password="BobPassword123!"
        )

    def test_register_user_api_success(self):
        payload = {
            "traveler_name": "charlie_voyager",
            "email": "charlie@example.com",
            "password": "CharliePassword123!"
        }
        response = self.client.post(
            "/registerUser/",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data.get("traveler_name"), "charlie_voyager")
        self.assertTrue(User.objects.filter(traveler_name="charlie_voyager").exists())

    def test_register_user_missing_fields(self):
        payload = {"email": "missing@example.com"}
        response = self.client.post(
            "/registerUser/",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_jwt_token_obtain_pair_success(self):
        response = self.client.post(
            "/api/token/",
            data={
                "traveler_name": "bob_traveler",
                "password": "BobPassword123!"
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tokens = response.json()
        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)

    def test_jwt_token_obtain_pair_invalid_credentials(self):
        response = self.client.post(
            "/api/token/",
            data={
                "traveler_name": "bob_traveler",
                "password": "WrongPassword!"
            }
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
