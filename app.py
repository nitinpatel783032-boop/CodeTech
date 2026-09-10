# ============================================
# Code Master AI - Backend (Flask)
# Runs on YOUR server (Render/Railway/etc), NOT in the browser.
# The Gemini API key stays hidden here - never exposed to users.
# ============================================

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # allows the CodeMaster frontend to call this backend

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-3.5-flash"  # fast + cheap, good for a coding-help chatbot
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are Code Master AI — a friendly, supportive coding buddy inside the "CodeMaster" web development learning platform (a Hindi/Hinglish coding tutorial site).

Your personality:
- Talk like a friendly, encouraging coding "bro" — casual, warm, never boring or textbook-like.
- Respond in Hinglish (Hindi + English mix) to match the site's tone, unless the user writes in pure English.
- Keep explanations simple and beginner-friendly. Assume the user is still learning.
- Use small code examples when helpful, wrapped in markdown code blocks with the right language tag.
- Break down concepts step-by-step.

Your focus areas ONLY:
- HTML, CSS, JavaScript, React, Node.js, MongoDB, Git & GitHub, Python/Flask, and general programming/debugging help.

If the user asks about something unrelated to web development or programming, politely decline and redirect them back to web dev topics. Example: "Haha, that's outside my zone bro — main tumhara Code Master AI hoon, web dev mein level up karne ke liye! Koi HTML, CSS, JS, ya coding sawal hai?"

Never break character. Never claim to be a general-purpose AI."""


def to_gemini_contents(messages):
    """
    Convert the frontend's Anthropic-style messages
    [{"role": "user"/"assistant", "content": "..."}]
    into Gemini's format:
    [{"role": "user"/"model", "parts": [{"text": "..."}]}]
    """
    contents = []
    for msg in messages:
        role = "model" if msg.get("role") == "assistant" else "user"
        contents.append({
            "role": role,
            "parts": [{"text": msg.get("content", "")}]
        })
    return contents


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages")

    if not messages or not isinstance(messages, list):
        return jsonify({"error": "messages array is required"}), 400

    try:
        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json={
                "system_instruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                },
                "contents": to_gemini_contents(messages),
                "generationConfig": {
                    "maxOutputTokens": 1024
                }
            },
            timeout=30,
        )
        resp_json = response.json()

        if "error" in resp_json:
            return jsonify({"error": resp_json["error"].get("message", "Gemini API error")}), 500

        reply_text = "Sorry bro, samajh nahi aaya. Phir se try karo?"
        candidates = resp_json.get("candidates")
        if candidates and isinstance(candidates, list) and len(candidates) > 0:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts and "text" in parts[0]:
                reply_text = parts[0]["text"]

        return jsonify({"reply": reply_text})

    except requests.exceptions.RequestException:
        return jsonify({"error": "AI service tak nahi pahunch paya. Phir se try karo."}), 500
    except Exception:
        return jsonify({"error": "Server mein kuch gadbad ho gayi."}), 500


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Code Master AI backend is running"}), 200


if __name__ == "__main__":
    # For local testing only. In production, gunicorn runs this (see Procfile).
    app.run(debug=True, port=5000)
