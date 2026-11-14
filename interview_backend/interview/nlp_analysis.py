from difflib import SequenceMatcher

try:
    from sentence_transformers import SentenceTransformer, util
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception:
    SentenceTransformer = None
    util = None
    sbert_model = None

try:
    from textblob import TextBlob
except Exception:
    TextBlob = None

# Sentiment analysis (offline, TextBlob with fallback)
def analyze_sentiment(text):
    if TextBlob is not None:
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            if polarity > 0:
                label = "POSITIVE"
            elif polarity < 0:
                label = "NEGATIVE"
            else:
                label = "NEUTRAL"
            return {"label": label, "score": float(polarity)}
        except Exception:
            pass
    return {"label": "NEUTRAL", "score": 0.0}

# SBERT for semantic similarity with SequenceMatcher fallback
def compare_to_reference(answer, reference):
    if sbert_model is not None and util is not None:
        try:
            emb1 = sbert_model.encode(str(answer), convert_to_tensor=True)
            emb2 = sbert_model.encode(str(reference), convert_to_tensor=True)
            similarity = util.pytorch_cos_sim(emb1, emb2).item()
            return float(similarity)
        except Exception:
            pass
    return float(SequenceMatcher(None, str(answer).lower(), str(reference).lower()).ratio())
