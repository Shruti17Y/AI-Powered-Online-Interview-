from difflib import SequenceMatcher

_sbert_model = None
_sbert_util = None

def get_sbert():
    global _sbert_model, _sbert_util
    if _sbert_model is None:
        try:
            from sentence_transformers import SentenceTransformer, util
            _sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
            _sbert_util = util
        except Exception:
            _sbert_model = False
            _sbert_util = False
    return (
        _sbert_model if _sbert_model is not False else None,
        _sbert_util if _sbert_util is not False else None
    )

# Sentiment analysis (lazy load TextBlob with fallback)
def analyze_sentiment(text):
    try:
        from textblob import TextBlob
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
        return {"label": "NEUTRAL", "score": 0.0}

# SBERT for semantic similarity with SequenceMatcher fallback
def compare_to_reference(answer, reference):
    model, util = get_sbert()
    if model is not None and util is not None:
        try:
            emb1 = model.encode(str(answer), convert_to_tensor=True)
            emb2 = model.encode(str(reference), convert_to_tensor=True)
            similarity = util.pytorch_cos_sim(emb1, emb2).item()
            return float(similarity)
        except Exception:
            pass
    return float(SequenceMatcher(None, str(answer).lower(), str(reference).lower()).ratio())
