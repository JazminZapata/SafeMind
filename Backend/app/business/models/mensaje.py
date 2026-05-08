from app import db
from datetime import datetime

class Mensaje(db.Model):
    __tablename__ = 'mensajes'

    id           = db.Column(db.Integer, primary_key=True)
    sesion_id    = db.Column(db.Integer, db.ForeignKey('sesiones.id'), nullable=False)
    remitente_id = db.Column(db.Integer, db.ForeignKey('personas.id'), nullable=False)
    contenido    = db.Column(db.Text, nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    sesion    = db.relationship('Sesion', back_populates='mensajes')
    remitente = db.relationship('Persona', back_populates='mensajes')

    def __repr__(self):
        return f'<Mensaje {self.id}>'

    def to_dict(self):
        return {
            'id':           self.id,
            'sesion_id':    self.sesion_id,
            'remitente_id': self.remitente_id,
            'contenido':    self.contenido,
            'created_at':   self.created_at.isoformat() if self.created_at else None,
            'remitente':    self.remitente.to_dict() if self.remitente else None
        }