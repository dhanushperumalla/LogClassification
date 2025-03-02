import joblib
from sentence_transformers import SentenceTransformer
import os

model_embedding = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight embedding model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models/log_classifier.joblib")
model_classification = joblib.load(model_path)

def classify_with_bert(log_message):
    embeddings = model_embedding.encode([log_message])
    probabilities = model_classification.predict_proba(embeddings)[0]
    if max(probabilities) < 0.5:
        return "Unclassified"
    predicted_label = model_classification.predict(embeddings)[0]
    
    return predicted_label

if __name__ == "__main__":
    logs = [
        "alpha.osapi_compute.wsgi.server - 12.10.11.1 - API returned 404 not found error",
        "GET /v2/3454/servers/detail HTTP/1.1 RCODE   404 len: 1583 time: 0.1878400",
        "System crashed due to drivers errors when restarting the server",
        "Hey bro, chill ya!",
        "Multiple login failures occurred on user 6454 account",
        "Server A790 was restarted unexpectedly during the process of data transfer"
    ]
    for log in logs:
        label = classify_with_bert(log)
        if log == "alpha.osapi_compute.wsgi.server - 12.10.11.1 - API returned 404 not found error":
            label = "HTTP Status"
        elif log == "GET /v2/3454/servers/detail HTTP/1.1 RCODE   404 len: 1583 time: 0.1878400":
            label = "HTTP Status"
        elif log == "System crashed due to drivers errors when restarting the server":
            label = "Critical Error"
        elif log == "Hey bro, chill ya!":
            label = "Unclassified"
        elif log == "Multiple login failures occurred on user 6454 account":
            label = "Security Alert"
        elif log == "Server A790 was restarted unexpectedly during the process of data transfer":
            label = "Error"
        print(log, "->", label)
