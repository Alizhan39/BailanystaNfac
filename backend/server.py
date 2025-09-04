from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import itertools

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "https://alizhan39.github.io"]}},
    supports_credentials=True,
)

# ===== In-memory demo "DB" =====
_ids = itertools.count(1)
_posts = {}
_comments = {}
_likes = set()
_users = {}

def now_iso(): return datetime.utcnow().isoformat() + "Z"

def get_token():
    auth = request.headers.get("Authorization", "")
    parts = auth.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None

def require_user():
    token = get_token()
    user = _users.get(token)
    if not user:
        return None, (jsonify({"error": "unauthorized"}), 401)
    return user, None

@app.get("/api/health")
def health():
    return jsonify(ok=True)

# ===== Auth =====
@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or data.get("u") or "user").strip()
    user = {"id": abs(hash(username)) % 10_000_000, "username": username}
    token = f"dev-{username}"
    _users[token] = user
    return jsonify({"token": token, "user": user})

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or data.get("u") or "user").strip()
    user = {"id": abs(hash(username)) % 10_000_000, "username": username}
    token = f"dev-{username}"
    _users[token] = user
    return jsonify({"token": token, "user": user})

@app.get("/api/auth/me")
def me():
    token = get_token()
    user = _users.get(token)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    return jsonify(user)

# ===== Posts =====
@app.get("/api/posts")
def list_posts():
    token = get_token()
    user = _users.get(token)
    cursor = request.args.get("cursor")
    page_size = 10
    ids = sorted(_posts.keys(), reverse=True)
    if cursor:
        try:
            c = int(cursor)
            ids = [i for i in ids if i < c]
        except ValueError:
            pass
    page_ids = ids[:page_size]
    items = []
    for pid in page_ids:
        p = _posts[pid].copy()
        p["likes"] = sum(1 for pair in _likes if pair[1] == pid)
        p["liked"] = bool(user and (user["id"], pid) in _likes)
        items.append(p)
    next_cursor = str(page_ids[-1]) if len(ids) > page_size else None
    return jsonify({"items": items, "nextCursor": next_cursor})

@app.post("/api/posts")
def create_post():
    user, err = require_user()
    if err: return err
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or data.get("content") or "").strip()
    pid = next(_ids)
    post = {"id": pid, "author": user, "text": text, "createdAt": now_iso()}
    _posts[pid] = post
    return jsonify(post), 201

@app.post("/api/posts/<int:post_id>/like")
def like(post_id):
    user, err = require_user()
    if err: return err
    _likes.add((user["id"], post_id))
    count = sum(1 for pair in _likes if pair[1] == post_id)
    return jsonify({"ok": True, "likes": count, "liked": True})

@app.delete("/api/posts/<int:post_id>/like")
def unlike(post_id):
    user, err = require_user()
    if err: return err
    _likes.discard((user["id"], post_id))
    count = sum(1 for pair in _likes if pair[1] == post_id)
    return jsonify({"ok": True, "likes": count, "liked": False})

# ===== Comments =====
@app.get("/api/posts/<int:post_id>/comments")
def list_comments(post_id):
    return jsonify(_comments.get(post_id, []))

@app.post("/api/posts/<int:post_id>/comments")
def add_comment(post_id):
    user, err = require_user()
    if err: return err
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    cid = next(_ids)
    c = {"id": cid, "postId": post_id, "author": user, "text": text, "createdAt": now_iso()}
    _comments.setdefault(post_id, []).append(c)
    return jsonify(c), 201

@app.delete("/api/posts/<int:post_id>/comments/<int:comment_id>")
def delete_comment(post_id, comment_id):
    user, err = require_user()
    if err: return err
    lst = _comments.get(post_id, [])
    before = len(lst)
    _comments[post_id] = [c for c in lst if not (c["id"] == comment_id and c["author"]["id"] == user["id"])]
    return jsonify({"ok": True, "deleted": before - len(_comments[post_id])})

# seed demo posts
if not _posts:
    for label in ["Welcome to Bailanysta!", "Post #2", "Post #3", "Post #4", "Post #5"]:
        pid = next(_ids)
        _posts[pid] = {"id": pid, "author": {"id": 0, "username": "system"}, "text": label, "createdAt": now_iso()}
