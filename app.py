# ============================================
# Code Master AI - Backend (Flask)
# Runs on YOUR server (Render/Railway/etc), NOT in the browser.
# The Anthropic API key stays hidden here - never exposed to users.
# ============================================

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # allows the CodeMaster frontend to call this backend

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"

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


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages")

    if not messages or not isinstance(messages, list):
        return jsonify({"error": "messages array is required"}), 400

    try:
        response = requests.post(
            ANTHROPIC_URL,
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,  # set as an env var, never hardcoded
                "anthropic-version": "2023-06-01",
            },
            json={
                "model": "claude-sonnet-5",  # good balance of quality + cost. Use 'claude-haiku-4-5-20251001' for cheaper/faster replies.
                "max_tokens": 1024,
                "system": SYSTEM_PROMPT,
                "messages": messages,  # e.g. [{"role": "user", "content": "..."}]
            },
            timeout=30,
        )
        resp_json = response.json()

        if "error" in resp_json:
            return jsonify({"error": resp_json["error"].get("message", "Anthropic API error")}), 500

        reply_text = "Sorry bro, samajh nahi aaya. Phir se try karo?"
        content = resp_json.get("content")
        if content and isinstance(content, list) and len(content) > 0:
            reply_text = content[0].get("text", reply_text)

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
