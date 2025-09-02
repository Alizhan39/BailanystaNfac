from flask import Flask
from flask_migrate import Migrate
from .db import db
from .models import *  # noqa
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    Migrate(app, db)
    with app.app_context():
        db.create_all()
    return app
