# BailanystaNfac
A minimal social network where users can create posts on a profile page and browse a feed. This version uses a FastAPI backend and a React (Vite + TypeScript + Tailwind) frontend, connected over a simple JSON API. Optional extras include theme switching, likes/comments, search, and an AI content helper endpoint (server-side only).

# Bailanysta (FastAPI + React)


A compact social network demo with a **FastAPI** backend and **React (Vite + TypeScript + Tailwind)** frontend.


## Features
- Profile page to create posts
- Feed page with author + text (newest first)
- Own server API (FastAPI)
- Routing between **/feed** and **/profile** (React Router)
- Dark/light theme toggle (persisted)
- Likes & comments (in-memory store)
- Keyword / hashtag search (server-side)
- Optional: AI content helper endpoint (server-side; requires `OPENAI_API_KEY`)


> This demo uses an in-memory store for simplicity. For persistence, replace `store.py` with a database-backed implementation (e.g., SQLModel + SQLite/Postgres).


## Why FastAPI + React?
- **FastAPI**: modern Python API framework, fast, type-hinted, great docs, easy to deploy.
- **React + Vite + TS**: fast dev server, type safety, simple build, Tailwind for rapid UI.
- **Clear separation**: server and client as independent apps; clean CORS and deploy paths.


## Getting Started


### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
