from django import forms
from .models import myUser


class myUserForm(forms.ModelForm):
    class Meta:
        model = myUser
        fields = ["traveler_name", "password"]