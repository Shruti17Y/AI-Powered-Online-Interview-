from django.db import models
from django.contrib.auth.models import User

# Add UserProfile model for user roles
default_role = 'user'
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('hr', 'HR'),
        ('admin', 'Admin'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=default_role)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
    
    @property
    def profile_pic_url(self):
        if self.profile_pic:
            return self.profile_pic.url
        return None


from django.contrib.auth.hashers import make_password

class Company(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=100)
    salary = models.CharField(max_length=100)
    experience_required = models.CharField(max_length=100)
    description = models.TextField()
    contact_info = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    required_skills = models.CharField(max_length=255)
    benefits = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    hr_email = models.EmailField(blank=True, null=True)
    company_password = models.CharField(max_length=128, blank=True, null=True)  # hashed password

    def save(self, *args, **kwargs):
        # Only hash if not already a valid Django hash
        if self.company_password and not str(self.company_password).startswith('pbkdf2_sha256$'):
            print('[Company.save] Hashing password:', self.company_password)
            self.company_password = make_password(self.company_password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)  # <-- Add this line
    start_time = models.DateTimeField(auto_now_add=True)
    current_question = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

class Answer(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE)
    question_number = models.IntegerField()
    question_text = models.TextField()
    answer_text = models.TextField()
    sbert_score = models.FloatField(null=True, blank=True)
    deepface_result = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class InterviewResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    score = models.FloatField()
    pass_fail = models.CharField(max_length=10)  # e.g., 'Pass' or 'Fail'
    date = models.DateTimeField(auto_now_add=True)
    attempt_number = models.IntegerField(default=1)  # Track attempt number for same company
    round_type = models.CharField(max_length=20, default="Camera")  # 'Camera' or 'Aptitude'

    def __str__(self):
        return f"{self.user.username} - {self.company.name} - {self.pass_fail}"

    def save(self, *args, **kwargs):
        # Calculate attempt number before saving
        if not self.pk:  # Only for new records
            previous_attempts = InterviewResult.objects.filter(
                user=self.user, 
                company=self.company,
                round_type=self.round_type
            ).count()
            self.attempt_number = previous_attempts + 1
        super().save(*args, **kwargs)

