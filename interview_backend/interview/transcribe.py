import speech_recognition as sr
import os

def transcribe_audio(wav_path):
    # Check if file exists
    if not os.path.exists(wav_path):
        return "Audio file not found"
    
    # Check file size
    file_size = os.path.getsize(wav_path)
    if file_size == 0:
        return "Audio file is empty"
    
    recognizer = sr.Recognizer()
    
    with sr.AudioFile(wav_path) as source:
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.record(source)
    
    try:
        # Uses Google Web Speech API (requires internet)
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Could not understand audio - please speak more clearly"
    except sr.RequestError as e:
        return f"Speech recognition service error: {e}"
    except Exception as e:
        return f"Audio processing error: {str(e)}" 