# Web Bot - RAG Chat Interface

A Streamlit app that loads any webpage, indexes its content, and lets you chat
with it using Google Gemini + LangChain (RAG).

## Folder contents

```
webbot-rag/
├── app.py                 # Main Streamlit app
├── requirements.txt        # Pinned Python dependencies
├── runtime.txt              # Python version pin (for Render)
├── .streamlit/config.toml   # Streamlit server config
├── .env.example              # Example env file (copy to .env locally)
└── .gitignore
```

## 1. Local setup

```bash
# Clone / unzip the folder, then:
cd webbot-rag

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Set your API key
cp .env.example .env
# then edit .env and paste your real key, OR just export it directly:
export GOOGLE_API_KEY=your_gemini_api_key_here   # Windows: set GOOGLE_API_KEY=...

streamlit run app.py
```

Get a free Gemini API key at: https://aistudio.google.com/apikey

## 2. Deploy on Render

1. Push this folder to a GitHub repository (root of the repo = this folder).
2. Go to https://render.com → **New +** → **Web Service** → connect your repo.
3. Configure:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `streamlit run app.py --server.port $PORT --server.address 0.0.0.0`
4. Under **Environment Variables**, add:
   - Key: `GOOGLE_API_KEY`
   - Value: your actual Gemini API key
5. Click **Create Web Service**. Render will build and deploy automatically,
   and gives you a live URL like `https://your-app.onrender.com`.

Notes:
- Free tier spins down after ~15 min idle; first request after that takes 30-60s to wake up.
- Any push to your connected branch triggers an automatic redeploy.
- If the build fails with dependency errors, keep the versions in `requirements.txt`
  pinned exactly as given — unpinned versions can cause pip to hang or fail
  with a `resolution-too-deep` error.

## How it works

1. **Load URL**: the page is fetched, cleaned, split into chunks, embedded
   with `gemini-embedding-001`, and stored in a FAISS vector index.
2. **Chat**: each question either goes through the RAG pipeline (retrieves
   relevant chunks + asks Gemini) or straight to Gemini for simple/general
   questions, based on the `need_rag()` heuristic in `app.py`.
