from __future__ import annotations
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Post, User
from ..db import db


bp = Blueprint("posts", __name__, url_prefix="/api/posts")


@bp.get("")
def list_posts():
   # newest first
   posts = Post.query.order_by(Post.created_at.desc()).limit(100).all()
   def to_json(p: Post):
      return {
           "id": p.id,
           "text": p.text,
           "created_at": p.created_at.isoformat(),
           "author": {
               "id": p.author.id,
               "username": p.author.username,
               "created_at": p.author.created_at.isoformat(),
           },
       }
   return jsonify([to_json(p) for p in posts])


@bp.post("")
@jwt_required()
def create_post():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    payload = request.get_json(force=True) or {}
    text = (payload.get("text") or "").strip()
    if not text:
        return jsonify({"error": "text required"}), 400
    if len(text) > 1000:
        return jsonify({"error": "text too long (1000 chars max)"}), 413
    post = Post(user_id=user.id, text=text)
    db.session.add(post)
    db.session.commit()
    return jsonify({
        "id": post.id,
        "text": post.text,
        "created_at": post.created_at.isoformat(),
        "author": {"id": user.id, "username": user.username, "created_at": user.created_at.isoformat()},
    }), 201
