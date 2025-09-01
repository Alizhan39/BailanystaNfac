# Bailanysta – Flask API + React (Vite + TypeScript)


A minimal social network where users can create posts on a profile page and browse a feed of posts from everyone.


## Demo Features (Level 1)
- **Profile page** to register a username and create posts.
- **Feed page** listing posts (author + text), newest first.
- **Modern component tree** with React Router, typed props, and small composable components.


> Images are omitted by design per spec. All external calls are via the backend.


---


## Tech Stack & Why
- **Flask 3 + SQLAlchemy 2** – simple, reliable, easy to deploy; great for REST APIs.
- **JWT (flask-jwt-extended)** – minimal stateless auth with a single access token.
- **React + Vite + TypeScript + Tailwind** – fast DX, type safety, clean styling.
- **Zustand** – tiny predictable state for auth token/username.
- **GitHub Actions** – build & test on every push.


Trade-off: we avoided server-side templating and SSR to keep the codebase small and clear for the assignment.


---


## Install & Run


### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export JWT_SECRET_KEY=change-me
export DATABASE_URL=sqlite:///bailanysta.db
python wsgi.py # runs on http://localhost:8000
