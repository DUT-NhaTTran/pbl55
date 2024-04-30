from django.contrib import admin
from .models import Pbl5

class Pbl5Admin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

# Register your models here.

admin.site.register(Pbl5, Pbl5Admin)