from __future__ import annotations
from datetime import datetime
from .db import db


class User(db.Model):
__tablename__ = "users"
id = db.Column(db.Integer, primary_key=True)
username = db.Column(db.String(80), unique=True, nullable=False)
created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
posts = db.relationship("Post", backref="author", lazy=True)


class Post(db.Model):
__tablename__ = "posts"
id = db.Column(db.Integer, primary_key=True)
user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
text = db.Column(db.Text, nullable=False)
created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
