from flask import Flask
from flask_migrate import Migrate
from .db import db
from .models import *  # noqa: F401,F403
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    Migrate(app, db)
    with app.app_context():
        # таблицы создадутся, если миграций ещё не было
        db.create_all()
    return app
