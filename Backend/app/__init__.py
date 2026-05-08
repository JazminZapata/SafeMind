import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
from config import Config

db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    socketio.init_app(app)
    CORS(app)

    from app.business.models.persona import Persona
    from app.business.models.estudiante import Estudiante
    from app.business.models.profesional import Profesional
    from app.business.models.sesion import Sesion
    from app.business.models.mensaje import Mensaje

    from app.presentation.routes import main_bp
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()

    return app