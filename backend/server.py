from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
# Разрешаем фронту на GH Pages ходить к API
CORS(app, resources={r"/api/*": {"origins": [
    "https://alizhan39.github.io",
    "https://alizhan39.github.io/BailanystaNfac"
]}}, supports_credentials=True)

@app.get("/api/health")
def health():
    return jsonify(ok=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
