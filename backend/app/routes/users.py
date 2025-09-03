from flask import Blueprint, jsonify
from sqlalchemy import func
from ..db import db
from ..models import User, Post

bp = Blueprint("users", __name__, url_prefix="/api/users")

@bp.get("/<int:uid>")
def user_info(uid: int):
    u = User.query.get_or_404(uid)
    posts = db.session.execute(
        db.select(func.count(Post.id)).where(Post.user_id == uid)
    ).scalar_one()
    return jsonify({
        "id": u.id,
        "username": u.username,
        "created_at": u.created_at.isoformat(),
        "posts": int(posts),
    })
