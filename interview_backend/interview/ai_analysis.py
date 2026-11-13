import os
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
import logging
import re
from collections import Counter

# Import ML libraries with error handling
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning("Scikit-learn not available")

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False
    logging.warning("OpenCV not available")

# Set TensorFlow and PyTorch as unavailable for Python 3.13
TENSORFLOW_AVAILABLE = False
PYTORCH_AVAILABLE = False
AUDIO_AVAILABLE = False  # librosa not compatible with Python 3.13

logger = logging.getLogger(__name__)

class AIAnalysisEngine:
    """
    Main AI analysis engine for interview processing
    Compatible with Python 3.13
    """
    
    def __init__(self):
        self.nlp_analyzer = NLPAnalyzer() if SKLEARN_AVAILABLE else None
        self.face_analyzer = FaceExpressionAnalyzer() if OPENCV_AVAILABLE else None
        
    def analyze_interview(self, 
                         text_data: Optional[str] = None,
                         audio_file: Optional[str] = None,
                         video_file: Optional[str] = None) -> Dict:
        """
        Comprehensive interview analysis
        """
        results = {
            'nlp_analysis': None,
            'audio_analysis': None,
            'face_analysis': None,
            'overall_score': 0.0,
            'recommendations': []
        }
        
        # NLP Analysis
        if text_data and self.nlp_analyzer:
            try:
                results['nlp_analysis'] = self.nlp_analyzer.analyze_text(text_data)
            except Exception as e:
                logger.error(f"NLP analysis failed: {e}")
        
        # Audio Analysis (simplified for Python 3.13)
        if audio_file:
            try:
                results['audio_analysis'] = self._simple_audio_analysis(audio_file)
            except Exception as e:
                logger.error(f"Audio analysis failed: {e}")
        
        # Face Expression Analysis
        if video_file and self.face_analyzer:
            try:
                results['face_analysis'] = self.face_analyzer.analyze_video(video_file)
            except Exception as e:
                logger.error(f"Face analysis failed: {e}")
        
        # Calculate overall score
        results['overall_score'] = self._calculate_overall_score(results)
        results['recommendations'] = self._generate_recommendations(results)
        
        return results
    
    def _simple_audio_analysis(self, audio_file: str) -> Dict:
        """Simple audio analysis without librosa"""
        try:
            # Basic file analysis
            file_size = os.path.getsize(audio_file)
            file_extension = os.path.splitext(audio_file)[1].lower()
            
            # Simple scoring based on file properties
            size_score = min(1.0, file_size / (1024 * 1024))  # Normalize by 1MB
            format_score = 1.0 if file_extension in ['.wav', '.mp3', '.m4a'] else 0.5
            
            clarity_score = (size_score + format_score) / 2
            
            return {
                'file_size': file_size,
                'format': file_extension,
                'clarity_score': clarity_score,
                'analysis': self._get_audio_analysis(clarity_score, 0.5)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _calculate_overall_score(self, results: Dict) -> float:
        """Calculate overall interview score"""
        scores = []
        
        if results['nlp_analysis']:
            scores.append(results['nlp_analysis'].get('confidence_score', 0))
        
        if results['audio_analysis']:
            scores.append(results['audio_analysis'].get('clarity_score', 0))
        
        if results['face_analysis']:
            scores.append(results['face_analysis'].get('confidence_score', 0))
        
        return np.mean(scores) if scores else 0.0
    
    def _generate_recommendations(self, results: Dict) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        if results['nlp_analysis']:
            if results['nlp_analysis'].get('confidence_score', 0) < 0.6:
                recommendations.append("Consider improving communication clarity")
        
        if results['audio_analysis']:
            if results['audio_analysis'].get('clarity_score', 0) < 0.7:
                recommendations.append("Ensure good audio quality for better analysis")
        
        if results['face_analysis']:
            if results['face_analysis'].get('confidence_score', 0) < 0.5:
                recommendations.append("Practice maintaining confident body language")
        
        return recommendations
    
    def _get_audio_analysis(self, clarity_score: float, pace_score: float) -> str:
        """Get audio analysis description"""
        if clarity_score >= 0.7:
            return "Good audio quality detected"
        elif clarity_score >= 0.5:
            return "Acceptable audio quality"
        else:
            return "Audio quality needs improvement"


class NLPAnalyzer:
    """Natural Language Processing analyzer for interview responses"""
    
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize NLP models"""
        if not SKLEARN_AVAILABLE:
            return
            
        try:
            self.vectorizer = TfidfVectorizer(
                max_features=1000,
                stop_words='english',
                ngram_range=(1, 2)
            )
            
            self.classifier = RandomForestClassifier(
                n_estimators=100,
                random_state=42
            )
        except Exception as e:
            logger.error(f"Failed to initialize NLP models: {e}")
    
    def analyze_text(self, text: str) -> Dict:
        """Analyze interview text response"""
        if not SKLEARN_AVAILABLE:
            return self._basic_text_analysis(text)
        
        try:
            # Advanced analysis with scikit-learn
            return self._advanced_text_analysis(text)
        except Exception as e:
            logger.error(f"Advanced text analysis failed: {e}")
            return self._basic_text_analysis(text)
    
    def _basic_text_analysis(self, text: str) -> Dict:
        """Basic text analysis without ML libraries"""
        try:
            # Basic text analysis
            word_count = len(text.split())
            sentence_count = len([s for s in text.split('.') if s.strip()])
            avg_sentence_length = word_count / max(sentence_count, 1)
            
            # Sentiment analysis (basic implementation)
            positive_words = ['good', 'great', 'excellent', 'positive', 'success', 'confident', 'excited', 'passionate']
            negative_words = ['bad', 'poor', 'negative', 'failure', 'problem', 'difficult', 'struggle', 'worried']
            
            text_lower = text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            sentiment_score = (positive_count - negative_count) / max(word_count, 1)
            
            # Vocabulary diversity
            unique_words = len(set(text_lower.split()))
            vocabulary_diversity = unique_words / max(word_count, 1)
            
            # Confidence score based on various factors
            confidence_score = min(1.0, max(0.0, 
                (avg_sentence_length / 20) * 0.2 +      # Sentence structure
                (sentiment_score + 1) * 0.4 +           # Sentiment
                (word_count / 100) * 0.2 +              # Response length
                vocabulary_diversity * 0.2               # Vocabulary diversity
            ))
            
            return {
                'word_count': word_count,
                'sentence_count': sentence_count,
                'avg_sentence_length': avg_sentence_length,
                'sentiment_score': sentiment_score,
                'vocabulary_diversity': vocabulary_diversity,
                'confidence_score': confidence_score,
                'analysis': self._get_text_analysis(confidence_score)
            }
            
        except Exception as e:
            logger.error(f"Basic text analysis failed: {e}")
            return {'error': str(e)}
    
    def _advanced_text_analysis(self, text: str) -> Dict:
        """Advanced text analysis with scikit-learn"""
        basic_result = self._basic_text_analysis(text)
        
        try:
            # Additional features with TF-IDF
            if self.vectorizer:
                # Fit and transform the text
                tfidf_matrix = self.vectorizer.fit_transform([text])
                tfidf_features = tfidf_matrix.toarray()[0]
                
                # Calculate feature importance
                feature_importance = np.sum(tfidf_features)
                
                # Adjust confidence score
                basic_result['feature_importance'] = feature_importance
                basic_result['confidence_score'] = min(1.0, 
                    basic_result['confidence_score'] + (feature_importance / 1000) * 0.1
                )
                
        except Exception as e:
            logger.error(f"Advanced analysis failed: {e}")
        
        return basic_result
    
    def _get_text_analysis(self, confidence_score: float) -> str:
        """Get text analysis description"""
        if confidence_score >= 0.8:
            return "Excellent communication skills demonstrated"
        elif confidence_score >= 0.6:
            return "Good communication with room for improvement"
        elif confidence_score >= 0.4:
            return "Fair communication, needs more practice"
        else:
            return "Communication needs significant improvement"


class FaceExpressionAnalyzer:
    """Face expression analysis for interview confidence"""
    
    def __init__(self):
        self.face_cascade = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize face detection models"""
        if not OPENCV_AVAILABLE:
            return
            
        try:
            # Load pre-trained face detection model
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
        except Exception as e:
            logger.error(f"Failed to initialize face detection: {e}")
    
    def analyze_video(self, video_file: str) -> Dict:
        """Analyze video for face expressions and confidence"""
        if not OPENCV_AVAILABLE:
            return {'error': 'Computer vision libraries not available'}
        
        try:
            cap = cv2.VideoCapture(video_file)
            frame_count = 0
            face_detected_frames = 0
            confidence_scores = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Convert to grayscale for face detection
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Detect faces
                faces = self.face_cascade.detectMultiScale(
                    gray, 
                    scaleFactor=1.1, 
                    minNeighbors=5, 
                    minSize=(30, 30)
                )
                
                if len(faces) > 0:
                    face_detected_frames += 1
                    
                    # Basic confidence scoring based on face position and size
                    for (x, y, w, h) in faces:
                        # Center position score
                        center_score = 1.0 - abs(x + w/2 - frame.shape[1]/2) / (frame.shape[1]/2)
                        
                        # Size score (not too close, not too far)
                        size_score = min(1.0, w * h / (frame.shape[0] * frame.shape[1] * 0.1))
                        
                        frame_confidence = (center_score + size_score) / 2
                        confidence_scores.append(frame_confidence)
                
                # Process every 10th frame for efficiency
                if frame_count % 10 == 0:
                    continue
            
            cap.release()
            
            # Calculate overall metrics
            face_detection_rate = face_detected_frames / max(frame_count, 1)
            avg_confidence = np.mean(confidence_scores) if confidence_scores else 0.0
            
            return {
                'total_frames': frame_count,
                'face_detected_frames': face_detected_frames,
                'face_detection_rate': face_detection_rate,
                'confidence_score': avg_confidence,
                'analysis': self._get_face_analysis(face_detection_rate, avg_confidence)
            }
            
        except Exception as e:
            logger.error(f"Face analysis failed: {e}")
            return {'error': str(e)}
    
    def _get_face_analysis(self, detection_rate: float, confidence: float) -> str:
        """Get face analysis description"""
        if detection_rate >= 0.8 and confidence >= 0.7:
            return "Excellent eye contact and confident posture"
        elif detection_rate >= 0.6 and confidence >= 0.5:
            return "Good presence with room for improvement"
        else:
            return "Work on maintaining eye contact and confident posture"


# Utility functions
def get_ai_analysis_engine() -> AIAnalysisEngine:
    """Get AI analysis engine instance"""
    return AIAnalysisEngine()

def analyze_interview_response(text: str) -> Dict:
    """Quick function to analyze interview text response"""
    engine = get_ai_analysis_engine()
    return engine.analyze_interview(text_data=text)

def deepface_analysis(face_data):
    """
    DeepFace analysis function for facial expression analysis.
    face_data: could be an image file, video file, or base64 string.
    """
    try:
        from deepface import DeepFace
        import cv2
        import numpy as np
        
        # If face_data is a file object (from request.FILES)
        if hasattr(face_data, 'read'):
            file_bytes = np.asarray(bytearray(face_data.read()), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            face_data.seek(0)  # Reset file pointer for potential future reads
        else:
            # Assume it's a file path
            img = cv2.imread(face_data)
        
        if img is None:
            return {"error": "Invalid image data"}
        
        # Analyze emotions using DeepFace
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        
        # Process results
        if isinstance(result, list):
            emotions = [r['emotion'] for r in result]
            dominant = [r['dominant_emotion'] for r in result]
        else:
            emotions = result['emotion']
            dominant = result['dominant_emotion']
        
        # Convert numpy types to Python floats for JSON serialization
        def to_float(val):
            if isinstance(val, np.generic):
                return float(val)
            return float(val)
        
        if isinstance(emotions, dict):
            emotions = {k: to_float(v) for k, v in emotions.items()}
        elif isinstance(emotions, list):
            emotions = [{k: to_float(v) for k, v in emo.items()} for emo in emotions]
        
        return {
            "dominant_emotion": dominant,
            "emotion_scores": emotions
        }
        
    except ImportError:
        return {"error": "DeepFace library not available"}
    except Exception as e:
        return {"error": f"DeepFace analysis failed: {str(e)}"}
