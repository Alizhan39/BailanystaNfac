rom __future__ import annotations
import os


class Config:
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///bailanysta.db")
SQLALCHEMY_TRACK_MODIFICATIONS = False
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "devsecret-change-me")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
