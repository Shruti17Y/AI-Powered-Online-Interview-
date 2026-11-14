try:
    import sounddevice as sd
except Exception:
    sd = None
import numpy as np
import librosa
import webrtcvad
import speech_recognition as sr
import scipy.io.wavfile as wav
import wave
import contextlib
import json
import os
import sys

# ========== CONFIGURATION ==========
SAMPLE_RATE = 16000
CHANNELS = 1
RECORD_SECONDS = 10
OUTPUT_WAV = 'output.wav'

# ========== AUDIO RECORDING ==========
def record_audio(filename=OUTPUT_WAV, duration=RECORD_SECONDS, sample_rate=SAMPLE_RATE):
    if sd is None:
        raise RuntimeError("sounddevice is not available in headless cloud environment")
    print(f"Recording for {duration} seconds...")
    audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=CHANNELS, dtype='int16')
    sd.wait()
    wav.write(filename, sample_rate, audio)
    print(f"Audio saved to {filename}")

# ========== LOAD AUDIO ==========
def load_audio(filename, sample_rate=SAMPLE_RATE):
    y, sr = librosa.load(filename, sr=sample_rate)
    return y, sr

# ========== LIBROSA ANALYSIS ==========
def analyze_librosa(y, sr):
    # Silence detection
    intervals = librosa.effects.split(y, top_db=30)
    # Energy
    energy = np.sum(y ** 2) / len(y)
    # Tempo
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    return {
        'intervals': intervals.tolist(),
        'energy': float(energy),
        'tempo': float(tempo)
    }

# ========== WEBRTCVAD ANALYSIS ==========
def read_wave(path):
    with contextlib.closing(wave.open(path, 'rb')) as wf:
        num_channels = wf.getnchannels()
        assert num_channels == 1
        sample_width = wf.getsampwidth()
        assert sample_width == 2
        sample_rate = wf.getframerate()
        assert sample_rate == SAMPLE_RATE
        frames = wf.readframes(wf.getnframes())
        return frames

def frame_generator(frame_duration_ms, audio, sample_rate):
    n = int(sample_rate * (frame_duration_ms / 1000.0) * 2)
    offset = 0
    while offset + n <= len(audio):
        yield audio[offset:offset + n]
        offset += n

def vad_collector(audio_path, aggressiveness=2):
    vad = webrtcvad.Vad(aggressiveness)
    audio = read_wave(audio_path)
    frames = list(frame_generator(30, audio, SAMPLE_RATE))
    speech_flags = [vad.is_speech(frame, SAMPLE_RATE) for frame in frames]
    speech_ratio = sum(speech_flags) / len(speech_flags) if frames else 0
    noise_flag = speech_ratio < 0.5  # Heuristic: too little speech = noisy or silent
    return {
        'speech_ratio': speech_ratio,
        'noise_flag': noise_flag
    }

# ========== TRANSCRIPTION ==========
def transcribe_audio(filename):
    recognizer = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio)
    except Exception as e:
        text = ""
    return text

# ========== SCORING LOGIC ==========
def score_confidence(librosa_result, transcript):
    score = 0
    # Long pause detection
    intervals = librosa_result['intervals']
    pauses = []
    for i in range(1, len(intervals)):
        prev_end = intervals[i-1][1]
        curr_start = intervals[i][0]
        pause_duration = (curr_start - prev_end) / SAMPLE_RATE
        if pause_duration > 0.5:
            score -= 1
            pauses.append(pause_duration)
    # Stammering words
    stammer_words = ["uh", "umm", "um", "er", "ah"]
    stammer_count = sum(transcript.lower().count(w) for w in stammer_words)
    score -= 2 * stammer_count
    # Clear sentence (>=5s, high energy)
    for interval in intervals:
        seg_len = (interval[1] - interval[0]) / SAMPLE_RATE
        if seg_len >= 5 and librosa_result['energy'] > 0.01:
            score += 2
    return {
        'score': score,
        'pauses': pauses,
        'stammer_count': stammer_count
    }

# ========== MAIN PIPELINE ==========
def analyze_interview_audio(audio_path=None):
    if audio_path is None:
        record_audio(OUTPUT_WAV)
        audio_path = OUTPUT_WAV
    y, sr = load_audio(audio_path)
    librosa_result = analyze_librosa(y, sr)
    vad_result = vad_collector(audio_path)
    transcript = transcribe_audio(audio_path)
    scoring = score_confidence(librosa_result, transcript)
    result = {
        'transcript': transcript,
        'librosa': librosa_result,
        'vad': vad_result,
        'scoring': scoring
    }
    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    audio_path = sys.argv[1] if len(sys.argv) > 1 else None
    analyze_interview_audio(audio_path) 