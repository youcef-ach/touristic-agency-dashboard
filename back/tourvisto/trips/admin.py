from django.contrib import admin
from .models import Trip, TripImage, Activity, ItineraryDay

admin.site.register(Trip)
admin.site.register(Activity)
admin.site.register(ItineraryDay)
admin.site.register(TripImage)
