# ============================================
# Code Master AI - Backend (Flask)
# Runs on YOUR server (Render/Railway/etc), NOT in the browser.
# Your Gemini API key stays hidden here - never exposed to users.
#
# v3: switched from Anthropic's Claude API to Google's Gemini API,
# since Nitin has a Gemini API key. Still supports text + image
# (screenshot) messages exactly the same way from the frontend.
# ============================================

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # allows the CodeMaster frontend to call this backend

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# 👉 Gemini model to use. "gemini-flash-latest" always points at Google's
# newest fast Flash model, so you don't have to update this when Google
# ships a new version. If you'd rather pin an exact version, swap it for
# something like "gemini-3.6-flash".
GEMINI_MODEL = "gemini-flash-latest"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SYSTEM_PROMPT = """You are Code Master AI — a friendly, supportive coding buddy inside the "CodeMaster" web development learning platform (a Hindi/Hinglish coding tutorial site).

Your personality:
- Talk like a friendly, encouraging coding "bro" — casual, warm, never boring or textbook-like.
- Respond in Hinglish (Hindi + English mix) to match the site's tone, unless the user writes in pure English.
- Keep explanations simple and beginner-friendly. Assume the user is still learning.
- Use small code examples when helpful, wrapped in markdown code blocks with the right language tag.
- Break down concepts step-by-step.

Your focus areas ONLY:
- HTML, CSS, JavaScript, React, Node.js, MongoDB, Git & GitHub, Python/Flask, and general programming/debugging help.

Image handling: users may send you a screenshot of their code or an error message.
When they do, carefully read the code/error in the image, identify the bug or issue,
explain what's wrong in simple terms, and show the corrected code.

If the user asks about something unrelated to web development or programming, politely decline and redirect them back to web dev topics. Example: "Haha, that's outside my zone bro — main tumhara Code Master AI hoon, web dev mein level up karne ke liye! Koi HTML, CSS, JS, ya coding sawal hai?"

Never break character. Never claim to be a general-purpose AI."""


def anthropic_style_to_gemini(messages):
    """
    The frontend (code-master-ai.js) builds messages in this shape:
        {"role": "user" | "assistant",
         "content": [
            {"type": "text", "text": "..."},
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "..."}}
         ]}

    Gemini's REST API wants a different shape:
        {"role": "user" | "model",
         "parts": [
            {"text": "..."},
            {"inline_data": {"mime_type": "image/png", "data": "..."}}
         ]}

    This function converts one into the other so nothing on the frontend
    had to change.
    """
    gemini_contents = []
    for msg in messages:
        role = "model" if msg.get("role") == "assistant" else "user"
        content = msg.get("content")

        parts = []
        if isinstance(content, str):
            # Gemini rejects an empty "text" field, so only add it if there's
            # actually something to say.
            if content.strip():
                parts.append({"text": content})
        elif isinstance(content, list):
            for block in content:
                if block.get("type") == "text":
                    text_value = block.get("text", "")
                    if text_value.strip():  # skip blank/whitespace-only text
                        parts.append({"text": text_value})
                elif block.get("type") == "image":
                    source = block.get("source", {})
                    parts.append({
                        "inline_data": {
                            "mime_type": source.get("media_type", "image/png"),
                            "data": source.get("data", ""),
                        }
                    })
        if parts:
            gemini_contents.append({"role": role, "parts": parts})

    return gemini_contents


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages")

    if not messages or not isinstance(messages, list):
        return jsonify({"error": "messages array is required"}), 400

    try:
        gemini_contents = anthropic_style_to_gemini(messages)

        response = requests.post(
            GEMINI_URL,
            params={"key": GEMINI_API_KEY},  # Gemini takes the key as a URL query param
            headers={"Content-Type": "application/json"},
            json={
                "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": gemini_contents,
                "generationConfig": {"maxOutputTokens": 1200},
            },
            timeout=60,  # image analysis can take a little longer than plain text
        )
        resp_json = response.json()

        if "error" in resp_json:
            return jsonify({"error": resp_json["error"].get("message", "Gemini API error")}), 500

        reply_text = "Sorry bro, samajh nahi aaya. Phir se try karo?"
        candidates = resp_json.get("candidates")
        if candidates and len(candidates) > 0:
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
    return jsonify({"status": "Code Master AI backend is running (Gemini)"}), 200


if __name__ == "__main__":
    # For local testing only. In production, gunicorn runs this (see Procfile).
    app.run(debug=True, port=5000)
