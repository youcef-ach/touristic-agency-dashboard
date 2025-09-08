from .forms import myUserForm
from django.http import HttpResponse, JsonResponse
from .models import myUser
import json


def createUserView(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = myUserForm(data)
        if form.is_valid():
            user = myUser.objects.create(
                traveler_name=form.cleaned_data["traveler_name"]
            )
            user.set_password(form.cleaned_data["password"])
            user.save()
            return HttpResponse("success")
        else:
            return JsonResponse({"message": "failed"})
    else:
        return JsonResponse({"message": "get not allowed"})
