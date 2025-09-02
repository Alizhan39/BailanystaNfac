from __future__ import annotations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..db import db
from ..models import User

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.post("/register")
def register():
    payload = request.get_json(force=True) or {}
    username = (payload.get("username") or "").strip()
    if not username:
        return jsonify({"error": "username required"}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": {
        "id": user.id, "username": user.username, "created_at": user.created_at.isoformat()
    }})

@bp.post("/login")
def login():
    payload = request.get_json(force=True) or {}
    username = (payload.get("username") or "").strip()
    if not username:
        return jsonify({"error": "username required"}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "not found"}), 404
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": {
        "id": user.id, "username": user.username, "created_at": user.created_at.isoformat()
    }})

@bp.get("/me")
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    return jsonify({"id": user.id, "username": user.username, "created_at": user.created_at.isoformat()})
