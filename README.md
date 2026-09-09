# Code Master AI - Backend (Flask / Python)

Secure Python backend for the Code Master AI chatbot. Your Anthropic API
key stays on the server as an environment variable — never in the browser.

## 1. Test it locally

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export ANTHROPIC_API_KEY=your-real-api-key-here
python3 app.py
```

Runs at `http://localhost:5000`. Test it:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is a JavaScript closure?"}]}'
```

## 2. Deploy for real (Render — easiest free option)

1. Push this `backend` folder as its own GitHub repo.
2. Go to https://render.com, sign in with GitHub.
3. **New +** → **Web Service** → select your repo.
4. Settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Under **Environment**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your real Anthropic API key
6. **Create Web Service**. You'll get a URL like:
   `https://code-master-ai-backend.onrender.com`
7. Your chatbot endpoint is:
   `https://code-master-ai-backend.onrender.com/api/chat`

Render's free tier sleeps after inactivity, so the first request after a
while can take 30-50 seconds to wake up — fine for a learning site's
chatbot.

## 3. Point the frontend at this URL

Already done in this project — `assets/js/code-master-ai.js` has:

```javascript
const CMA_BACKEND_URL = "https://code-master-ai-backend.onrender.com/api/chat";
```

If your Render URL is different, update this one line.
