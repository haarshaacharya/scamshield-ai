from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from PIL import Image
import json
import re
import os

app = Flask(__name__)
CORS(app)

# Gemini API Key
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


@app.route("/")
def home():
    return jsonify({
        "status": "ScamShield AI Backend Running"
    })


# ==========================
# TEXT SCAM ANALYSIS
# ==========================
@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        data = request.json

        if not data:
            return jsonify({
                "error": "No data received"
            }), 400

        message = data.get("message", "")

        if not message.strip():
            return jsonify({
                "error": "Message is required"
            }), 400

        prompt = f"""
You are ScamShield AI.

Analyze the following message and return ONLY JSON.

Message:
{message}

Format:

{{
  "risk": "Scam or Safe",
  "score": 0,
  "explanation": "short explanation",
  "reasons": [
    "reason1",
    "reason2",
    "reason3"
  ]
}}

Rules:
- score must be between 0 and 100
- no markdown
- return valid JSON only
"""

        response = model.generate_content(prompt)

        text = response.text.strip()
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

        result = json.loads(text)

        return jsonify(result)

    except Exception as e:

        print("TEXT ERROR:", str(e))

        return jsonify({
            "risk": "Error",
            "score": 0,
            "explanation": str(e),
            "reasons": []
        }), 500


# ==========================
# IMAGE SCAM ANALYSIS
# ==========================
@app.route("/analyze-image", methods=["POST"])
def analyze_image():

    try:

        if "image" not in request.files:
            return jsonify({
                "error": "No image uploaded"
            }), 400

        image_file = request.files["image"]
        image = Image.open(image_file)

        prompt = """
You are ScamShield AI.

Analyze this screenshot.

Check if it contains:

- Fake payment screenshot
- Fake UPI screenshot
- OTP scam
- Lottery scam
- Banking fraud
- Phishing attempt
- Safe screenshot

Return ONLY JSON:

{
  "risk": "Safe",
  "score": 10,
  "explanation": "Short explanation",
  "reasons": [
    "reason 1",
    "reason 2",
    "reason 3"
  ]
}

Rules:
- Return valid JSON only
- No markdown
"""

        response = model.generate_content([
            prompt,
            image
        ])

        text = response.text.strip()
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

        result = json.loads(text)

        return jsonify(result)

    except Exception as e:

        print("IMAGE ERROR:", str(e))

        return jsonify({
            "risk": "Error",
            "score": 0,
            "explanation": str(e),
            "reasons": []
        }), 500


# ==========================
# LINK SCAM ANALYSIS
# ==========================
@app.route("/analyze-link", methods=["POST"])
def analyze_link():

    try:

        data = request.json

        if not data:
            return jsonify({
                "error": "No data received"
            }), 400

        url = data.get("url", "")

        if not url.strip():
            return jsonify({
                "error": "URL is required"
            }), 400

        prompt = f"""
You are ScamShield AI.

Analyze this URL:

{url}

Return ONLY JSON:

{{
  "risk": "Scam or Safe",
  "score": 0,
  "explanation": "short explanation",
  "reasons": [
    "reason1",
    "reason2",
    "reason3"
  ]
}}

Rules:
- score must be between 0 and 100
- no markdown
- return valid JSON only
"""

        response = model.generate_content(prompt)

        text = response.text.strip()
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

        result = json.loads(text)

        return jsonify(result)

    except Exception as e:

        print("LINK ERROR:", str(e))

        return jsonify({
            "risk": "Error",
            "score": 0,
            "explanation": str(e),
            "reasons": []
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)