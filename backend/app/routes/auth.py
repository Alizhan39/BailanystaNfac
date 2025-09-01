from __future__ import annotations
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from ..db import db


bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register():
data = request.get_json(force=True) or {}
username = (data.get("username") or "").strip()
if not username:
return jsonify({"error": "username required"}), 400
existing = User.query.filter_by(username=username).first()
if existing:
return jsonify({"error": "username taken"}), 409
user = User(username=username)
db.session.add(user)
db.session.commit()
token = create_access_token(identity=user.id)
return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "created_at": user.created_at.isoformat()}}), 201


@bp.get("/me")
@jwt_required()
def me():
uid = get_jwt_identity()
user = User.query.get_or_404(uid)
return jsonify({"id": user.id, "username": user.username, "created_at": user.created_at.isoformat()})
