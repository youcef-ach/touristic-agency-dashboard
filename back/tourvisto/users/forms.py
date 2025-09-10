from django import forms
from .models import user
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.validators import UnicodeUsernameValidator


class userCreationForm(forms.ModelForm):
    password2 = forms.CharField(max_length=30, required=True)

    class Meta:
        model = user
        fields = ["traveler_name", "password"]

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("password") == cleaned_data.get("password2"):
            return cleaned_data
        else:
            raise forms.ValidationError("passwords must match")
