from app import db
from datetime import datetime

class Persona(db.Model):
    __tablename__ = 'personas'

    id          = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), nullable=False, unique=True)
    nombre      = db.Column(db.String(100), nullable=False)
    correo      = db.Column(db.String(100), nullable=False, unique=True)
    telefono    = db.Column(db.String(20), nullable=True)
    foto_url    = db.Column(db.String(255), nullable=True)  # viene de Google/Firebase gratis
    rol         = db.Column(db.String(20), nullable=False)  # 'estudiante' | 'profesional'
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    estudiante  = db.relationship('Estudiante', back_populates='persona',
                                  uselist=False, cascade='all, delete-orphan')
    profesional = db.relationship('Profesional', back_populates='persona',
                                  uselist=False, cascade='all, delete-orphan')
    mensajes    = db.relationship('Mensaje', back_populates='remitente',
                                  cascade='all, delete-orphan')