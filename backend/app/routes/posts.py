from __future__ import annotations

from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_, or_, func

from ..models import Post, User, Like
from ..db import db


bp = Blueprint("posts", __name__, url_prefix="/api/posts")


def _serialize_post(p: Post, like_counts: dict[int, int] | None = None) -> dict:
    return {
        "id": p.id,
        "text": p.text,
        "created_at": p.created_at.isoformat(),
        "author": {
            "id": p.author.id,
            "username": p.author.username,
            "created_at": p.author.created_at.isoformat(),
        },
        "likes": (like_counts or {}).get(p.id, 0),
    }


@bp.get("")
def list_posts():
    """
    Cursor pagination: /api/posts?cursor=<created_at_iso>|<id>&limit=20
    Returns: { items: [...], next_cursor: "<iso>|<id>" | null }
    """
    cursor = request.args.get("cursor")
    limit = min(int(request.args.get("limit", 20)), 50)

    q = Post.query

    if cursor:
        try:
            ts_s, id_s = cursor.split("|")
            ts = datetime.fromisoformat(ts_s)
            q = q.filter(or_(Post.created_at < ts, and_(Post.created_at == ts, Post.id < int(id_s))))
        except Exception:
            return jsonify({"error": "bad cursor"}), 400



    # get one extra to decide if there's a next page
    items = q.order_by(Post.created_at.desc(), Post.id.desc()).limit(limit + 1).all()

    next_cursor = None
    if len(items) > limit:
        last = items[limit - 1]
        next_cursor = f"{last.created_at.isoformat()}|{last.id}"
        items = items[:limit]

    # like counts in a single grouped query
    like_counts: dict[int, int] = {}
    if items:
        post_ids = [p.id for p in items]
        rows = db.session.execute(
            db.select(Like.post_id, func.count(Like.id))
            .where(Like.post_id.in_(post_ids))
            .group_by(Like.post_id)
        ).all()
        for pid, cnt in rows:
            like_counts[int(pid)] = int(cnt)

    return jsonify({"items": [_serialize_post(p, like_counts) for p in items], "next_cursor": next_cursor})


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

    # Optional real-time: broadcast to connected WebSocket clients if Flask-Sock is set up
    app = current_app
    for ws in list(getattr(app, "pubsub_clients", set())):
        try:
            ws.send_json({"type": "new_post", "post_id": post.id})
        except Exception:
            try:
                app.pubsub_clients.discard(ws)
            except Exception:
                pass

    return jsonify(_serialize_post(post, {})), 201


@bp.post("/<int:post_id>/like")
@jwt_required()
def like_post(post_id: int):
    uid = get_jwt_identity()
    if not Post.query.get(post_id):
        return jsonify({"error": "not found"}), 404

    exists = Like.query.filter_by(user_id=uid, post_id=post_id).first()
    if not exists:
        db.session.add(Like(user_id=uid, post_id=post_id))
        db.session.commit()
    return jsonify({"ok": True}), 201


@bp.delete("/<int:post_id>/like")
@jwt_required()
def unlike_post(post_id: int):
    uid = get_jwt_identity()
    like = Like.query.filter_by(user_id=uid, post_id=post_id).first()
    if like:
        db.session.delete(like)
        db.session.commit()
    return jsonify({"ok": True})
