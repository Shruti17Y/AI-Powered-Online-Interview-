from django.contrib import admin
from .models import Company, InterviewSession, Answer

admin.site.register(Company)
admin.site.register(InterviewSession)
admin.site.register(Answer)