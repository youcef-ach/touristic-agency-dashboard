from django.http import JsonResponse
from django.db import IntegrityError, DatabaseError
from .forms import userCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.forms import ValidationError


@csrf_exempt
def createUserView(request):
    if request.method != "POST":
        return JsonResponse({"message": "GET not allowed"}, status=405)
    form = userCreationForm(request.POST)
    try:
        if not form.is_valid():
            return JsonResponse(
                {"message": "Validation failed", "errors": form.errors}, status=400
            )
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password"])
        user.save()
    except ValidationError as e:
        return JsonResponse(
            {"message": "Validation error", "errors": e.message_dict}, status=400
        )
    except IntegrityError as e:
        return JsonResponse({"message": "Integrity error", "error": str(e)}, status=400)
    except DatabaseError as e:
        return JsonResponse({"message": "Database error", "error": str(e)}, status=500)
    except Exception as e:
        return JsonResponse(
            {"message": "Unexpected error", "error": str(e)}, status=500
        )

    return JsonResponse({"message": "success"}, status=201)