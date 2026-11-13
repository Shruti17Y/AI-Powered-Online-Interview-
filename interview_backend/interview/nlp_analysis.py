
from sentence_transformers import SentenceTransformer, util
from textblob import TextBlob
# Sentiment analysis (offline, TextBlob)
def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        label = "POSITIVE"
    elif polarity < 0:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"
    return {"label": label, "score": polarity}


# SBERT for semantic similarity
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

def compare_to_reference(answer, reference):
    emb1 = sbert_model.encode(answer, convert_to_tensor=True)
    emb2 = sbert_model.encode(reference, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(emb1, emb2).item()
    return float(similarity)
