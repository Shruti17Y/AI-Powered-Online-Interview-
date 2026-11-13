from django.urls import path
from . import views
from .views import AudioAnalysisView
from .views import FaceExpressionAPIView
from .views import delete_company
from .views import practice_questions
from .views import evaluate_answer
from .views import ProfileView
from .views import resume_scan
from .views import aptitude_questions, evaluate_aptitude_answer

urlpatterns =[
    path('api/hr/interview-history/', views.hr_company_interview_history, name='hr_company_interview_history'),
    path('api/users/', views.user_list, name='user-list'),
    path('api/questions/', views.question_queue, name='question-queue'),
    path('api/ai/expression/', FaceExpressionAPIView.as_view(), name='face-expression'),
    path('api/subject-questions/', views.subject_questions, name='subject-questions'),
    path('api/analyze-audio/', AudioAnalysisView.as_view(), name='analyze-audio'),
    path('start_interview/', views.start_interview),
    path('submit_answer/', views.submit_answer),
    path('get_results/<int:session_id>/', views.get_results),
    path('api/company/reject/<int:id>/', views.reject_company),
    path('api/company/register/', views.register_company, name='register-company'),
    path('api/company/pending/', views.list_pending_companies, name='pending-companies'),
    path('api/company/approve/<int:company_id>/', views.approve_company, name='approve-company'),
    path('api/company/approved/', views.list_approved_companies, name='approved-companies'),
    path('api/company/<int:id>/', views.get_company, name='get-company'),
    path('api/company/delete/<int:id>/', delete_company, name='delete_company'),
    path('api/practice-questions/', practice_questions, name='practice_questions'),
    path('api/evaluate-answer/', evaluate_answer, name='evaluate_answer'),
    path('api/aptitude-questions/', aptitude_questions, name='aptitude_questions'),
    path('api/evaluate-aptitude/', evaluate_aptitude_answer, name='evaluate_aptitude_answer'),
    path('api/login/', views.login_user, name='login_user'),
    path('api/logout/', views.logout_user, name='logout_user'),
    path('api/csrf/', views.csrf_token, name='csrf_token'),
    path('api/my-interviews/', views.my_interviews, name='my_interviews'),
    path('api/submit_interview_result/', views.submit_interview_result, name='submit_interview_result'),
    path('api/signup/', views.signup_user, name='signup_user'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/submit_aptitude_result/', views.submit_aptitude_result, name='submit_aptitude_result'),
    path('api/hr/login/', views.hr_login, name='hr_login'),
    path('api/resume-scan/', resume_scan, name='resume_scan'),
]

