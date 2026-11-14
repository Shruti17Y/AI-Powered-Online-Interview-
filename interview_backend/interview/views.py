from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, parser_classes, authentication_classes  
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Disable CSRF checks for session-authenticated requests on this view
from rest_framework.response import Response
from rest_framework.decorators import api_view
import numpy as np

SentenceTransformer = None
util = None

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token
import cv2
import numpy as np

try:
    from deepface import DeepFace
except Exception:
    DeepFace = None
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseNotFound
import json
import random

from .models import InterviewSession
from django.contrib.auth.models import User
 
from rest_framework.permissions import AllowAny

import os
from .audio_interview_analysis import analyze_interview_audio
import time
try:
    from pydub import AudioSegment
    from pydub.utils import which
except Exception:
    AudioSegment = None
    which = None
import subprocess

from .transcribe import transcribe_audio
from .nlp_analysis import analyze_sentiment, compare_to_reference

from .models import InterviewSession, Answer, Company, InterviewResult
from .question_bank import QUESTIONS
from .nlp_analysis import compare_to_reference
from .serializers import CompanySerializer
from django.contrib.auth.hashers import check_password

from django.utils import timezone
from .ai_analysis import deepface_analysis

import tempfile
from io import BytesIO
from PIL import Image

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import InterviewSession


import requests
from bs4 import BeautifulSoup
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import InterviewResult


from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from interview.models import UserProfile
import io
import os
import requests as http_requests
import docx2txt
from PyPDF2 import PdfReader

def scrape_gfg_qa(url, max_pairs=10):
    resp = requests.get(url, timeout=10)
    soup = BeautifulSoup(resp.text, 'html.parser')
    qa_pairs = []
    # Collect all possible qa_pairs
    for tag in soup.find_all(['strong', 'b', 'h2', 'h3']):
        q_text = tag.get_text(strip=True)
        if '?' in q_text and len(q_text) > 10:
            answer = None
            next_tag = tag.find_next_sibling()
            while next_tag and next_tag.name not in ['p', 'div']:
                next_tag = next_tag.find_next_sibling()
            if next_tag:
                answer = next_tag.get_text(strip=True)
            if answer and len(answer) > 10:
                qa_pairs.append({'question': q_text, 'answer': answer})
    # Shuffle and pick 10
    random.shuffle(qa_pairs)
    return qa_pairs[:max_pairs]

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def question_queue(request):
    return Response(QUESTIONS)

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    data = [{"id": u.id, "username": u.username, "email": u.email} for u in users]
    return Response(data)

@csrf_exempt
def answer_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question_id = data.get('question_id')
        answer = data.get('answer')

        # Here, you would call your AI analysis function
        # For now, let's mock it:
        analysis = f"AI analysis of your answer: '{answer}'"

        return JsonResponse({'analysis': analysis})
    else:
        return JsonResponse({'error': 'POST request required'}, status=400)

class FaceExpressionAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        print("Face expression API called")
        file_obj = request.FILES.get('frame')
        if not file_obj:
            print("No frame file received")
            return Response({'error': 'No image provided.'}, status=400)

        print(f"Received frame file: {file_obj.name}, size: {file_obj.size}")
        
        try:
            # Read image
            file_bytes = np.asarray(bytearray(file_obj.read()), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            if img is None:
                print("Failed to decode image")
                return Response({'error': 'Invalid image.'}, status=400)

            print(f"Image decoded successfully, shape: {img.shape}")
            
            # Check if DeepFace is available
            try:
                
                print("DeepFace imported successfully")
                return Response(
                    {'error': 'DeepFace library not available'},        
status=400
)

            except ImportError as e:
                print(f"DeepFace import error: {e}")
                return Response({'error': 'DeepFace library not available'}, status=500)

            result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
            print("DeepFace analysis completed")
            
            if isinstance(result, list):
                emotions = [r['emotion'] for r in result]
                dominant = [r['dominant_emotion'] for r in result]
            else:
                emotions = result['emotion']
                dominant = result['dominant_emotion']
            
            print("DeepFace emotion scores:", emotions)
            print("Dominant emotions:", dominant)
            
        
            def to_float(val):
                if isinstance(val, np.generic):
                    return float(val)
                return float(val)
            
            if isinstance(emotions, dict):
                emotions = {k: to_float(v) for k, v in emotions.items()}
            elif isinstance(emotions, list):
                emotions = [{k: to_float(v) for k, v in emo.items()} for emo in emotions]
                
            response_data = {
                'dominant_emotion': dominant,
                'emotion_scores': emotions
            }
            print("Sending response:", response_data)

            # Save the received frame for debugging
            import datetime, os
            debug_dir = 'debug_frames'
            os.makedirs(debug_dir, exist_ok=True)
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')
            debug_path = os.path.join(debug_dir, f'frame_{timestamp}.jpg')
            cv2.imwrite(debug_path, img)

            return Response(response_data, status=200)
            
        except Exception as e:
            print(f"DeepFace API error: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


def safe_remove(path, retries=5, delay=0.1):
    import os, time
    for _ in range(retries):
        try:
            os.remove(path)
            return
        except FileNotFoundError:
            return  # File already gone, that's fine!
        except PermissionError:
            time.sleep(delay)
    try:
        os.remove(path)
    except FileNotFoundError:
        pass  # File already gone, that's fine!
    except Exception:
        pass

class AudioAnalysisView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
       
        try:
            output = subprocess.check_output([
                r"C:\Users\Admin\Downloads\ffmpeg-7.1.1-essentials_build\ffmpeg-7.1.1-essentials_build\bin\ffmpeg.exe", "-version"
            ])
            print("FFMPEG OK:", output.decode())
        except Exception as e:
            print("FFMPEG NOT FOUND OR NOT WORKING:", e)
        import os
        audio_file = request.FILES.get('audio')
        if not audio_file:
            print('[DEBUG] No audio file provided in request.')
            return Response({'error': 'No audio file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        temp_path = 'temp_uploaded'
        with open(temp_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)
        try:
            file_size = os.path.getsize(temp_path)
            print(f'[DEBUG] Saved audio file: {temp_path}, Size: {file_size} bytes')
        except Exception as e:
            print(f'[DEBUG] Error getting size of saved audio file: {e}')
        
        wav_path = 'temp_uploaded.wav'
        try:
            audio = AudioSegment.from_file(temp_path)
            audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
            audio.export(wav_path, format='wav')
            try:
                wav_size = os.path.getsize(wav_path)
                print(f'[DEBUG] Exported wav file: {wav_path}, Size: {wav_size} bytes')
            except Exception as e:
                print(f'[DEBUG] Error getting size of wav file: {e}')
        except Exception as e:
            print(f'[DEBUG] Audio conversion failed: {e}')
            safe_remove(temp_path)
            return Response({'error': f'Audio conversion failed: {str(e)}'}, status=400)
        
        safe_remove(temp_path)
        
        try:
            result = analyze_interview_audio(wav_path)
            print(f'[DEBUG] Transcription result: {result}')
        except Exception as e:
            print(f'[DEBUG] Error in analyze_interview_audio: {e}')
            result = {'error': f'Audio analysis failed: {str(e)}'}
        
        transcription = transcribe_audio(wav_path)
        result['transcription'] = transcription

        # Add sentiment analysis
        if transcription and transcription not in ["Could not understand audio", "API error"]:
            result['sentiment'] = analyze_sentiment(transcription)
            # Reference answer similarity (if provided)
            reference_answer = request.data.get('reference_answer')
            if reference_answer:
                result['similarity_to_reference'] = compare_to_reference(transcription, reference_answer)

        safe_remove(wav_path)
        return Response(result)

@api_view(['GET'])
def subject_questions(request):
    return Response(QUESTIONS)
# Start a new interview session

@api_view(['POST'])
@permission_classes([AllowAny])
def start_interview(request):
    from django.contrib.auth.models import User
    user = User.objects.first()  # For demo/testing
    company_id = request.data.get('company_id')
    if not company_id:
        return Response({"error": "company_id is required"}, status=400)
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response({"error": "Company not found"}, status=404)
    session = InterviewSession.objects.create(user=user, company=company)
    question = QUESTIONS[0]
    return Response({
        "session_id": session.id,
        "question": question,
        "question_number": 1,
        "total_questions": len(QUESTIONS),
        "start_time": session.start_time,
        "time_limit_minutes": 30
    })

# Submit an answer and get the next question or finish
@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])  # Allow all users without authentication
def submit_answer(request):
    try:
        session_id = request.POST.get("session_id")
        question_number = int(request.POST.get("question_number", 1))
        current_question_data = request.POST.get("current_question")
        import os
        audio_file = request.FILES.get("audio")
        frame_file = request.FILES.get("frame")

        if not audio_file:
            print('[DEBUG] No audio uploaded in submit_answer')
            return JsonResponse({"error": "No audio uploaded"}, status=400)

        # Debug: print uploaded audio size
        try:
            audio_file.seek(0, os.SEEK_END)
            webm_size = audio_file.tell()
            audio_file.seek(0)
            print(f'[DEBUG] Uploaded webm audio size: {webm_size} bytes')
        except Exception as e:
            print(f'[DEBUG] Error getting uploaded webm audio size: {e}')

        # Convert to pydub AudioSegment
        try:
            audio_segment = AudioSegment.from_file(audio_file, format="webm")
            # Force 16kHz, mono, 16-bit PCM for Google API
            audio_segment = audio_segment.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        except Exception as e:
            print(f'[DEBUG] AudioSegment.from_file failed: {e}')
            return JsonResponse({"error": f"Audio conversion failed: {e}"}, status=400)
        output_buffer = BytesIO()
        audio_segment.export(output_buffer, format="wav")
        output_buffer.seek(0)

        # Save to a temp file for transcription
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
            tmpfile.write(output_buffer.read())
            tmpfile_path = tmpfile.name
        try:
            wav_size = os.path.getsize(tmpfile_path)
            print(f'[DEBUG] Exported wav file size: {wav_size} bytes')
        except Exception as e:
            print(f'[DEBUG] Error getting wav file size: {e}')
        # Save a copy for download/debugging
        import shutil
        shutil.copy(tmpfile_path, "debug_audio.wav")
        print(f'[DEBUG] Saved debug wav file: debug_audio.wav (copy of {tmpfile_path})')

        # Transcribe audio using the file path
        try:
            transcription = transcribe_audio(tmpfile_path)
            print(f'[DEBUG] Transcription result: {transcription}')
        except Exception as e:
            print(f'[DEBUG] Error in transcribe_audio: {e}')
            transcription = 'Could not transcribe audio'

        # Do not delete the wav file for now so user can download/debug
        # os.remove(tmpfile_path)


        # Get reference answer from question bank
        if current_question_data:
            current_question = json.loads(current_question_data)
            reference_answer = current_question.get("reference_answer", "")
        else:
            reference_answer = QUESTIONS[question_number - 1].get("reference_answer", "")

        # Compute SBERT score
        sbert_score = compare_to_reference(transcription, reference_answer)

        # Analyze facial expression if frame is provided
        deepface_result = None
        if frame_file:
            try:
                # Save the uploaded frame for debugging
                with open("debug_frame.jpg", "wb") as f:
                    f.write(frame_file.read())
                frame_file.seek(0)  # Reset pointer for further processing
                # Read image from InMemoryUploadedFile
                img = Image.open(frame_file)
                img = img.convert('RGB')
                img_np = np.array(img)
                # DeepFace expects BGR, so convert
                img_bgr = img_np[..., ::-1]
                print("Analyzing frame with DeepFace...")
                result = DeepFace.analyze(img_bgr, actions=['emotion'], enforce_detection=False)
                print("DeepFace result:", result)
                # Unwrap list if needed
                if isinstance(result, list):
                    result = result[0]
                
                # Convert numpy types to native Python types
                def convert_numpy_types(obj):
                    if isinstance(obj, np.generic):
                        return float(obj)  # Convert numpy types to Python float
                    elif isinstance(obj, dict):
                        return {k: convert_numpy_types(v) for k, v in obj.items()}
                    elif isinstance(obj, (list, tuple)):
                        return [convert_numpy_types(x) for x in obj]
                    return obj
                
                # Get the emotion data and convert numpy types
                dominant_emotion = result.get('dominant_emotion', 'unknown')
                emotion_scores = convert_numpy_types(result.get('emotion', {}))
                
                deepface_result = {
                    'dominant_emotion': dominant_emotion,
                    'emotion_scores': emotion_scores
                }
            except Exception as e:
                print('DeepFace error:', e)
                deepface_result = {'dominant_emotion': 'error', 'emotion_scores': {}}
        else:
            deepface_result = {'dominant_emotion': 'no_frame', 'emotion_scores': {}}

        return JsonResponse({
            "transcription": transcription,
            "reference_answer": reference_answer,
            "sbert_score": sbert_score,
            "deepface_result": deepface_result
        })

    except Exception as e:
        import traceback
        print("Exception in submit_answer:", e)
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)

# Get all results for a session
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_results(request, session_id):
    session = InterviewSession.objects.get(id=session_id, user=request.user)
    answers = Answer.objects.filter(session=session).order_by('question_number')
    results = []
    for ans in answers:
        results.append({
            "question": ans.question_text,
            "answer": ans.answer_text,
            "sbert_score": ans.sbert_score,
            "deepface_result": ans.deepface_result
        })
    return Response({"results": results})

# (Optional) Get all questions (if needed for frontend)
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_questions(request):
    return Response(QUESTIONS)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])
def register_company(request):
    print('REGISTRATION DATA:', request.data)
    print('REGISTERED COMPANY PASSWORD (raw):', request.data.get('company_password'))
    serializer = CompanySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_pending_companies(request):
    companies = Company.objects.filter(status="pending").order_by('-submitted_at')
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def approve_company(request, company_id):
    import secrets
    from django.core.mail import send_mail
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)
    company.status = "approved"
    company.save()
    # Send approval email via Node.js
    subject = f"Your company '{company.name}' has been approved!"
    message = f"""
Dear HR,

Your company registration has been approved!

Login to the HR portal:
URL: [YOUR_HR_PORTAL_URL]
Email: 'hr@gmail.com'
Password: (12345)

Please keep your password safe. You will need it to access your company dashboard.

Best regards,
Admin Team
"""
    print("Company object:", company)
    print("Company hr_email:", company.hr_email)
    if company.hr_email:
        print("Sending notification to Node:", company.hr_email, subject)
        try:
            requests.post(
                "http://localhost:5000/api/send-company-notification",
                json={
                    "email": company.hr_email,
                    "subject": subject,
                    "message": message
                },
                timeout=5
            )
        except Exception as e:
            print("Failed to send approval email via Node.js:", e)
    serializer = CompanySerializer(company)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_approved_companies(request):
    companies = Company.objects.filter(status="approved").order_by('-submitted_at')
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def reject_company(request, id):
    from django.core.mail import send_mail
    try:
        company = Company.objects.get(id=id)
        company.status = 'rejected'
        company.save()
        # Send rejection email via Node.js
        subject = f"Your company '{company.name}' registration was rejected"
        message = f"""
Dear HR,

We regret to inform you that your company registration has been rejected.

If you have questions, please contact support.

Best regards,
Admin Team
"""
        if company.hr_email:
            try:
                requests.post(
                    "http://localhost:5000/api/send-company-notification",
                    json={
                        "email": company.hr_email,
                        "subject": subject,
                        "message": message
                    },
                    timeout=5
                )
            except Exception as e:
                print("Failed to send rejection email via Node.js:", e)
        return Response({'message': 'Company rejected'})
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_company(request, id):
    print("=== DELETE COMPANY VIEW CALLED ===")
    from django.core.mail import send_mail
    try:
        company = Company.objects.get(id=id)
        print("Company hr_email:", company.hr_email)
        # Send deletion email before deleting via Node.js
        subject = f"Your company '{company.name}' has been deleted"
        message = (
            "Dear HR,\n\n"
            "Your company registration has been deleted by the admin.\n\n"
            "If you have questions, please contact support.\n\n"
            "Best regards,\nAdmin Team"
        )
        if company.hr_email:
            print("Sending notification to Node:", company.hr_email, subject)
            try:
                requests.post(
                    "http://localhost:5000/api/send-company-notification",
                    json={
                        "email": company.hr_email,
                        "subject": subject,
                        "message": message
                    },
                    timeout=5
                )
            except Exception as e:
                print("Failed to send deletion email via Node.js:", e)
        company.delete()
        return JsonResponse({'success': True})
    except Company.DoesNotExist:
        print("Company not found for deletion.")
        return HttpResponseNotFound('Company not found')
    except Exception as e:
        print("Unexpected error during company deletion:", e)
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

    

@api_view(['GET'])
def practice_questions(request):
    subject = request.GET.get('subject', '').lower()
    url_map = {
        'python': 'https://www.geeksforgeeks.org/python-interview-questions/',
        'java': 'https://www.geeksforgeeks.org/java-interview-questions/',
        'c++': 'https://www.geeksforgeeks.org/cpp-interview-questions/',
        'dbms': 'https://www.geeksforgeeks.org/dbms-interview-questions/',
        'dsa': 'https://www.geeksforgeeks.org/data-structure-interview-questions/',
        # Additional subjects
        'javascript': 'https://www.geeksforgeeks.org/javascript-interview-questions-and-answers/',
        'react': 'https://www.geeksforgeeks.org/reactjs-interview-questions-and-answers/',
        'nodejs': 'https://www.geeksforgeeks.org/node-js-interview-questions-and-answers/',
        'sql': 'https://www.geeksforgeeks.org/sql-interview-questions/',
        'html': 'https://www.geeksforgeeks.org/html-interview-questions-and-answers/',
        'css': 'https://www.geeksforgeeks.org/css-interview-questions-and-answers/',
        'os': 'https://www.geeksforgeeks.org/operating-systems-interview-questions/',
        'networking': 'https://www.geeksforgeeks.org/computer-network-interview-questions/',
        'oop': 'https://www.geeksforgeeks.org/object-oriented-programming-oops-interview-questions/',
    }
    url = url_map.get(subject)
    if not url:
        return Response([], status=404)

    try:
        qa_pairs = scrape_gfg_qa(url, max_pairs=10)
        # If not enough pairs, fill with placeholders
        while len(qa_pairs) < 10:
            qa_pairs.append({'question': 'No more questions found.', 'answer': ''})
        return Response(qa_pairs[:10])
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Load the model once (at module level)
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from sentence_transformers import SentenceTransformer, util

_view_sbert_model = None
_view_sbert_util = None

def get_view_sbert():
    global _view_sbert_model, _view_sbert_util
    if _view_sbert_model is None:
        try:
            from sentence_transformers import SentenceTransformer as ST, util as u
            _view_sbert_model = ST('all-MiniLM-L6-v2')
            _view_sbert_util = u
        except Exception:
            _view_sbert_model = False
            _view_sbert_util = False
    return (
        _view_sbert_model if _view_sbert_model is not False else None,
        _view_sbert_util if _view_sbert_util is not False else None
    )

@api_view(['POST'])
def evaluate_answer(request):
    data = request.data
    user_answer = data.get('answer', '')
    reference_answer = data.get('reference_answer', '')
    if not reference_answer:
        # Fallback for demo/testing
        reference_answer = "This is a sample correct answer for testing purposes."

    sbert_model, sbert_util = get_view_sbert()
    if sbert_model is not None and sbert_util is not None:
        try:
            emb1 = sbert_model.encode(user_answer, convert_to_tensor=True)
            emb2 = sbert_model.encode(reference_answer, convert_to_tensor=True)
            score = sbert_util.cos_sim(emb1, emb2).item()
            percent_score = round(score * 100, 2)
        except Exception:
            from difflib import SequenceMatcher
            percent_score = round(SequenceMatcher(None, str(user_answer).lower(), str(reference_answer).lower()).ratio() * 100, 2)
    else:
        from difflib import SequenceMatcher
        percent_score = round(SequenceMatcher(None, str(user_answer).lower(), str(reference_answer).lower()).ratio() * 100, 2)

    if percent_score > 80:
        feedback = "Excellent answer! Very relevant."
    elif percent_score > 60:
        feedback = "Good answer, but could be more detailed."
    elif percent_score > 40:
        feedback = "Some relevance, try to be more specific."
    else:
        feedback = "Your answer does not match the expected content. Try again."

    return Response({
        'score': percent_score,
        'feedback': feedback,
        'reference_answer': reference_answer
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_interview_result(request):
    data = request.data
    user_id = data.get('user')
    company_id = data.get('company')
    score = data.get('score')
    pass_fail = data.get('pass_fail')
    round_type = data.get('round_type', 'Camera')

    if not all([user_id, company_id, score, pass_fail]):
        return Response({'error': 'Missing required fields.'}, status=400)

    # Handle case where user_id might be malformed
    try:
        user_id = int(user_id)
        company_id = int(company_id)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid user_id or company_id format. Expected numbers.'}, status=400)

    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        company = Company.objects.get(id=company_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found.'}, status=404)

    result = InterviewResult.objects.create(
        user=user,
        company=company,
        score=score,
        pass_fail=pass_fail,
        round_type="Camera"
    )
    return Response({'success': True, 'result_id': result.id}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_aptitude_result(request):
    data = request.data
    user_id = data.get('user')
    company_id = data.get('company')
    score = data.get('score')
    pass_fail = data.get('pass_fail')

    if not all([user_id, company_id, score, pass_fail]):
        return Response({'error': 'Missing required fields.'}, status=400)

    try:
        user_id = int(user_id)
        company_id = int(company_id)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid user_id or company_id format. Expected numbers.'}, status=400)

    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        company = Company.objects.get(id=company_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found.'}, status=404)

    result = InterviewResult.objects.create(
        user=user,
        company=company,
        score=score,
        pass_fail=pass_fail,
        round_type="Aptitude"
    )
    return Response({'success': True, 'result_id': result.id}, status=201)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def get_company(request, id):
    try:
        company = Company.objects.get(id=id)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)

    if request.method == 'POST':
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required.'}, status=400)
        if password != company.company_password:
            return Response({'error': 'Invalid company password.'}, status=403)
        # Return full details if password is correct
        serializer = CompanySerializer(company)
        return Response(serializer.data)
    else:  # GET request
        # Return public details (customize if you want to hide sensitive info)
        serializer = CompanySerializer(company)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def hr_company_interview_history(request):
    """
    Returns all user interview results for a company, grouped by user email, with attempt history.
    Query param: company_id (required)
    """
    company_id = request.GET.get('company_id')
    if not company_id:
        return Response({'error': 'company_id is required.'}, status=400)
    try:
        company_id = int(company_id)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid company_id format.'}, status=400)
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found.'}, status=404)

    # Get all InterviewResults for this company
    all_results = InterviewResult.objects.filter(company=company).select_related('user').order_by('user__email', 'date')
    # Group by user
    from collections import defaultdict
    user_attempts = defaultdict(list)
    for result in all_results:
        user_attempts[result.user.email].append(result)

    from .serializers import UserInterviewHistorySerializer, InterviewResultHistorySerializer
    data = [
        {
            'email': email,
            'attempts': InterviewResultHistorySerializer(attempts, many=True).data
        }
        for email, attempts in user_attempts.items()
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def my_interviews(request):
    from django.contrib.auth import get_user_model
    user = request.user if hasattr(request, 'user') and request.user.is_authenticated else None
    if not user:
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({'error': 'No user specified.'}, status=400)
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid user_id format. Expected a number.'}, status=400)
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)
    results = InterviewResult.objects.filter(user=user).order_by('-date')
    data = [
        {
            'company': r.company.name,
            'company_id': r.company.id,
            'score': r.score,
            'pass_fail': r.pass_fail,
            'date': r.date,
            'attempt_number': r.attempt_number,
            'round_type': r.round_type,
        }
        for r in results
    ]
    return Response(data)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_user(request):
    """Login using Django sessions (no JWT). Expects email + password."""
    from django.contrib.auth import authenticate, login, get_user_model
    data = request.data
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    email_clean = email.strip().lower()
    UserModel = get_user_model()

    # 1. HARDCODED ADMIN CREDENTIALS
    if email_clean == 'sp6145947@gmail.com' and password == 'Shrutipatel@18':
        user = UserModel.objects.filter(email__iexact='sp6145947@gmail.com').first()
        if not user:
            user = UserModel.objects.filter(username='admin_shruti').first()
        if not user:
            user = UserModel.objects.create_superuser(
                username='admin_shruti',
                email='sp6145947@gmail.com',
                password='Shrutipatel@18'
            )
        else:
            user.email = 'sp6145947@gmail.com'
            user.is_staff = True
            user.is_superuser = True
            user.set_password('Shrutipatel@18')
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = 'admin'
        profile.save()

        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': 'admin',
            'is_superuser': True,
            'profilePicUrl': getattr(profile, 'profile_pic_url', None),
        })

    # 2. HARDCODED HR CREDENTIALS
    if email_clean == 'hr@gmail.com' and password == 'Hrshruti@18':
        user = UserModel.objects.filter(email__iexact='hr@gmail.com').first()
        if not user:
            user = UserModel.objects.filter(username='hr_shruti').first()
        if not user:
            user = UserModel.objects.create_user(
                username='hr_shruti',
                email='hr@gmail.com',
                password='Hrshruti@18'
            )
        else:
            user.email = 'hr@gmail.com'
            user.is_staff = False
            user.is_superuser = False
            user.set_password('Hrshruti@18')
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = 'hr'
        profile.save()

        # Ensure approved company exists for this HR
        company = Company.objects.filter(hr_email='hr@gmail.com').first()
        if not company:
            company = Company(
                name='TechCorp Solutions',
                location='Remote / Global',
                job_type='Full-Time',
                salary='$80,000 - $120,000',
                experience_required='2+ years',
                description='Leading technology provider for modern web and AI solutions.',
                contact_info='hr@gmail.com',
                status='approved',
                required_skills='Python, React, Django',
                benefits='Health insurance, 401(k), Remote work',
                company_password='Hrshruti@18'
            )
            company.save()
        else:
            if company.status != 'approved':
                company.status = 'approved'
            company.company_password = 'Hrshruti@18'
            company.save()

        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': 'hr',
            'is_superuser': False,
            'profilePicUrl': getattr(profile, 'profile_pic_url', None),
            'company_id': company.id,
            'company_name': company.name
        })

    try:
        user_obj = UserModel.objects.filter(email__iexact=email_clean).first()
        if not user_obj:
            user_obj = UserModel.objects.get(username=email)
    except UserModel.DoesNotExist:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(request, username=user_obj.username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    # Determine role: admin if superuser, otherwise from UserProfile (default 'user')
    try:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        role = 'admin' if user.is_superuser else getattr(profile, 'role', 'user')
        profile_pic_url = getattr(profile, 'profile_pic_url', None)
    except Exception:
        role = 'admin' if user.is_superuser else 'user'
        profile_pic_url = None
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
        'is_superuser': bool(getattr(user, 'is_superuser', False)),
        'profilePicUrl': profile_pic_url,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    from django.contrib.auth import logout
    logout(request)
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token(request):
    """Sets the csrftoken cookie and returns the token in JSON for cross-site frontends."""
    token = get_token(request)
    return Response({'csrftoken': token, 'detail': 'CSRF cookie set'})

User = get_user_model()

class ProfileView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if getattr(profile, 'profile_pic', None) else None
        })

    @method_decorator(csrf_exempt)
    def put(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Update user fields
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)

        # Optional password change
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        if current_password and new_password:
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)

        # Optional profile picture upload
        if 'profile_pic' in request.FILES:
            profile.profile_pic = request.FILES['profile_pic']

        user.save()
        profile.save()

        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if getattr(profile, 'profile_pic', None) else None
        })

    @method_decorator(csrf_exempt)
    def patch(self, request):
        # Delegate to put for partial updates
        return self.put(request)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def hr_login(request):
    """Login endpoint for HR using company email and password.
    Validates the HR's email against approved companies and checks the stored hashed password.
    Returns basic company info and its interviews on success.
    """
    data = request.data
    hr_email = ((data.get('email') or data.get('hr_email')) or '').strip().lower()
    company_password = data.get('password')

    if not hr_email or not company_password:
        return Response({'error': 'Email and password are required.'}, status=400)

    # 1. HARDCODED HR CREDENTIALS
    if hr_email == 'hr@gmail.com' and company_password == 'Hrshruti@18':
        company = Company.objects.filter(hr_email='hr@gmail.com').first()
        if not company:
            company = Company(
                name='TechCorp Solutions',
                location='Remote / Global',
                job_type='Full-Time',
                salary='$80,000 - $120,000',
                experience_required='2+ years',
                description='Leading technology provider for modern web and AI solutions.',
                contact_info='hr@gmail.com',
                status='approved',
                required_skills='Python, React, Django',
                benefits='Health insurance, 401(k), Remote work',
                company_password='Hrshruti@18'
            )
            company.save()
        else:
            if company.status != 'approved':
                company.status = 'approved'
            company.company_password = 'Hrshruti@18'
            company.save()

        interviews = InterviewSession.objects.filter(company=company)
        interview_data = [
            {
                'id': i.id,
                'user': i.user.username if i.user else 'Anonymous',
                'start_time': i.start_time,
                'completed': i.completed,
            }
            for i in interviews
        ]
        return Response({'company': company.name, 'company_id': company.id, 'interviews': interview_data})

    # 2. HARDCODED ADMIN ACCESS
    if hr_email == 'sp6145947@gmail.com' and company_password == 'Shrutipatel@18':
        company = Company.objects.first()
        interviews = InterviewSession.objects.all()[:20]
        interview_data = [
            {
                'id': i.id,
                'user': i.user.username if i.user else 'Anonymous',
                'start_time': i.start_time,
                'completed': i.completed,
            }
            for i in interviews
        ]
        return Response({'company': company.name if company else 'Admin Access', 'company_id': company.id if company else 1, 'interviews': interview_data})

    # Find approved company for this HR email
    companies = Company.objects.filter(hr_email__iexact=hr_email, status='approved')
    if not companies.exists():
        return Response({'error': 'No approved company found for this HR email.'}, status=404)
    if companies.count() > 1:
        return Response({'error': 'Multiple approved companies found with this HR email. Please contact support.'}, status=400)

    company = companies.first()

    # Validate password against stored hash
    password_valid = False
    if company.company_password:
        password_valid = check_password(company_password, company.company_password)
    if not password_valid:
        return Response({'error': 'Invalid password.'}, status=403)

    # Return interview summary for this company
    interviews = InterviewSession.objects.filter(company=company)
    interview_data = [
        {
            'id': i.id,
            'user': i.user.username if i.user else 'Anonymous',
            'start_time': i.start_time,
            'completed': i.completed,
        }
        for i in interviews
    ]
    return Response({'company': company.name, 'company_id': company.id, 'interviews': interview_data})

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def signup_user(request):
    """Signup endpoint that registers a new user."""
    User = get_user_model()
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=400)
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'id': user.id, 'username': user.username, 'email': user.email, 'role': 'user'})

    def put(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Update user fields
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        
        # Handle password change if provided
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if current_password and new_password:
            # Verify current password
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(new_password)
        
        # Handle profile picture upload
        if 'profile_pic' in request.FILES:
            profile.profile_pic = request.FILES['profile_pic']
        
        # Save changes
        user.save()
        profile.save()
        
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if profile.profile_pic else None
        })

    def delete(self, request):
        user = request.user
        try:
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if profile.profile_pic else None
        })
    def post(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if profile.profile_pic else None
        })
    def put(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if profile.profile_pic else None
        })
    def delete(self, request):
        user = request.user
        try:
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'email': user.email,
            'profilePicUrl': profile.profile_pic_url if profile.profile_pic else None
        }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def resume_scan(request):
    """Accepts a resume file (pdf/doc/docx/txt), extracts text, sends to a Hugging Face model, and returns analysis.
    Body: multipart/form-data with 'file'. Optional: 'model' (default: 'sentence-transformers/all-MiniLM-L6-v2').
    """
    try:
        upload = request.FILES.get('file')
        if not upload:
            return Response({'error': 'No file uploaded (expected field name "file").'}, status=400)

        filename = upload.name.lower()
        raw_bytes = upload.read()

        text_content = ''
        if filename.endswith('.pdf'):
            reader = PdfReader(io.BytesIO(raw_bytes))
            pages = [page.extract_text() or '' for page in reader.pages]
            text_content = '\n'.join(pages)
        elif filename.endswith('.docx'):
            # docx2txt expects a file path; write to temp
            with open('._tmp_resume.docx', 'wb') as f:
                f.write(raw_bytes)
            try:
                text_content = docx2txt.process('._tmp_resume.docx') or ''
            finally:
                try:
                    os.remove('._tmp_resume.docx')
                except Exception:
                    pass
        elif filename.endswith('.txt'):
            text_content = raw_bytes.decode('utf-8', errors='ignore')
        else:
            return Response({'error': 'Unsupported file type. Please upload pdf, docx, or txt.'}, status=400)

        if not text_content.strip():
            return Response({'error': 'Could not extract text from the uploaded file.'}, status=400)

        # Prepare prompt and call Hugging Face Inference API
        # Default to a lighter model suitable for text2text generation
        model_id = request.POST.get('model') or os.getenv('HF_MODEL_ID', 'google/flan-t5-base')
        hf_token = os.getenv('HF_TOKEN') or os.getenv('HF_API_TOKEN')
        if not hf_token:
            # Return parsed text if no token configured
            return Response({'warning': 'HF token not configured; returning extracted text only.', 'extracted_text': text_content[:5000]})

        prompt = (
            "You are an expert recruiter. Analyze the following resume text and provide: "
            "1) Key skills (list), 2) Years of experience estimate, 3) Summary in 3-5 lines, "
            "4) Suggested roles, 5) Notable projects, 6) Any red flags.\n\nResume:\n" + text_content[:10000]
        )

        # Using text-generation / text2text-generation task and wait for model spin-up
        try:
            resp = http_requests.post(
                f"https://api-inference.huggingface.co/models/{model_id}?wait_for_model=true",
                headers={"Authorization": f"Bearer {hf_token}"},
                json={"inputs": prompt, "parameters": {"max_new_tokens": 384}},
                timeout=60
            )
        except Exception as e:
            return Response({'warning': 'HF API request failed; returning extracted text only.', 'error': str(e), 'extracted_text': text_content[:5000]}, status=200)
        if resp.status_code >= 400:
            # Graceful fallback with extracted text so the endpoint is still useful in dev
            return Response({'warning': 'HF API error; returning extracted text only.', 'hf_status': resp.status_code, 'hf_detail': resp.text, 'extracted_text': text_content[:5000]}, status=200)
        try:
            data = resp.json()
        except Exception:
            data = {"generated_text": resp.text}

        # Normalize HF response
        generated = None
        if isinstance(data, list) and data and 'generated_text' in data[0]:
            generated = data[0]['generated_text']
        elif isinstance(data, dict) and 'generated_text' in data:
            generated = data['generated_text']
        else:
            generated = str(data)

        return Response({
            'model': model_id,
            'extracted_text_preview': text_content[:1000],
            'analysis': generated,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def aptitude_questions(request):
    """
    Fetch aptitude questions from public APIs
    """
    import requests
    import random
    
    # Try multiple API sources for aptitude questions
    questions = []
    
    try:
        # Source 1: Open Trivia Database (Mathematics, Science, etc.)
        trivia_url = "https://opentdb.com/api.php"
        trivia_params = {
            'amount': 5,
            'category': 19,  # Mathematics
            'type': 'multiple',
            'difficulty': 'medium'
        }
        
        trivia_response = requests.get(trivia_url, params=trivia_params, timeout=10)
        if trivia_response.status_code == 200:
            trivia_data = trivia_response.json()
            for item in trivia_data.get('results', []):
                # Shuffle options
                options = item['incorrect_answers'] + [item['correct_answer']]
                random.shuffle(options)
                correct_index = options.index(item['correct_answer'])
                
                questions.append({
                    'question': item['question'],
                    'options': options,
                    'correct': correct_index,
                    'category': 'Mathematics',
                    'difficulty': 'Medium'
                })
        
        # Source 2: Custom aptitude questions (fallback)
        custom_questions = [
            {
                'question': 'If a train travels at 60 km/h, how long will it take to travel 300 km?',
                'options': ['4 hours', '5 hours', '6 hours', '7 hours'],
                'correct': 1,
                'category': 'Time and Distance',
                'difficulty': 'Easy'
            },
            {
                'question': 'What comes next in the series: 2, 4, 8, 16, __?',
                'options': ['24', '32', '30', '28'],
                'correct': 1,
                'category': 'Number Series',
                'difficulty': 'Medium'
            },
            {
                'question': 'If 15% of a number is 45, what is the number?',
                'options': ['300', '250', '200', '150'],
                'correct': 0,
                'category': 'Percentage',
                'difficulty': 'Medium'
            },
            {
                'question': 'A shopkeeper sold an item for Rs. 1200 at a profit of 20%. What was the cost price?',
                'options': ['Rs. 1000', 'Rs. 1100', 'Rs. 900', 'Rs. 800'],
                'correct': 0,
                'category': 'Profit and Loss',
                'difficulty': 'Medium'
            },
            {
                'question': 'If 3 workers can complete a task in 6 days, how many days will 2 workers take?',
                'options': ['8 days', '9 days', '10 days', '12 days'],
                'correct': 1,
                'category': 'Time and Work',
                'difficulty': 'Medium'
            },
            {
                'question': 'The ratio of boys to girls in a class is 3:2. If there are 30 students, how many are boys?',
                'options': ['12', '15', '18', '20'],
                'correct': 2,
                'category': 'Ratio and Proportion',
                'difficulty': 'Easy'
            },
            {
                'question': 'A clock shows 3:15. What is the angle between the hour and minute hands?',
                'options': ['7.5°', '15°', '22.5°', '30°'],
                'correct': 0,
                'category': 'Clocks',
                'difficulty': 'Hard'
            },
            {
                'question': 'What is the probability of getting a head when tossing a fair coin?',
                'options': ['1/4', '1/2', '3/4', '1'],
                'correct': 1,
                'category': 'Probability',
                'difficulty': 'Easy'
            },
            {
                'question': 'If a rectangle has length 8 cm and width 6 cm, what is its area?',
                'options': ['14 cm²', '28 cm²', '48 cm²', '56 cm²'],
                'correct': 2,
                'category': 'Mensuration',
                'difficulty': 'Easy'
            },
            {
                'question': 'A person is 5 years older than his brother. If the sum of their ages is 25, how old is the brother?',
                'options': ['10 years', '15 years', '20 years', '25 years'],
                'correct': 0,
                'category': 'Problem on Ages',
                'difficulty': 'Medium'
            }
        ]
        
        # Add custom questions if we don't have enough from API
        if len(questions) < 10:
            questions.extend(custom_questions[:10-len(questions)])
        
        # Shuffle questions for variety
        random.shuffle(questions)
        
        return Response(questions[:10])  # Return max 10 questions
        
    except Exception as e:
        # Fallback to custom questions if API fails
        return Response(custom_questions[:10])

@api_view(['POST'])
def evaluate_aptitude_answer(request):
    """
    Evaluate aptitude test answers and provide results
    """
    try:
        data = request.data
        answers = data.get('answers', {})
        questions = data.get('questions', [])
        
        results = {}
        total_score = 0
        
        for idx, question in enumerate(questions):
            user_answer = answers.get(str(idx))
            is_correct = user_answer == question.get('correct')
            
            results[idx] = {
                'isCorrect': is_correct,
                'userAnswer': user_answer if user_answer is not None else 'Not answered',
                'correctAnswer': question.get('correct'),
                'score': 1 if is_correct else 0,
                'category': question.get('category', 'General'),
                'difficulty': question.get('difficulty', 'Medium')
            }
            
            if is_correct:
                total_score += 1
        
        percentage = (total_score / len(questions)) * 100 if questions else 0
        
        return Response({
            'results': results,
            'totalScore': total_score,
            'totalQuestions': len(questions),
            'percentage': round(percentage, 2),
            'passPercentage': 60,
            'passed': percentage >= 60
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
