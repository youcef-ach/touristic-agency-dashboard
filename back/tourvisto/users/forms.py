from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import user


class UserCreationForm(forms.ModelForm):
    """Form for creating new users in admin."""
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

    class Meta:
        model = user
        fields = ("traveler_name", "email")

    def clean_password2(self):
        p1 = self.cleaned_data.get("password1")
        p2 = self.cleaned_data.get("password2")
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("Passwords don't match")
        return p2

    def save(self, commit=True):
        u = super().save(commit=False)
        u.set_password(self.cleaned_data["password1"])  # ✅ hash here
        if commit:
            u.save()
        return u


class UserChangeForm(forms.ModelForm):
    """Form for updating users in admin."""
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = user
        fields = ("traveler_name", "email", "password", "is_active", "is_staff", "is_superuser")
