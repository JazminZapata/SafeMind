from app import db
from datetime import datetime

class Sesion(db.Model):
    __tablename__ = 'sesiones'

    id              = db.Column(db.Integer, primary_key=True)
    estudiante_id   = db.Column(db.Integer, db.ForeignKey('estudiantes.id'), nullable=False)
    profesional_id  = db.Column(db.Integer, db.ForeignKey('profesionales.id'), nullable=False)
    tema            = db.Column(db.String(200), nullable=True)
    estado          = db.Column(db.String(20), nullable=False, default='activa')
    # 'activa' | 'cerrada'
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    estudiante  = db.relationship('Estudiante', back_populates='sesiones')
    profesional = db.relationship('Profesional', back_populates='sesiones')
    mensajes    = db.relationship('Mensaje', back_populates='sesion',
                                  cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Sesion {self.id}>'

    def to_dict(self):
        return {
            'id':             self.id,
            'estudiante_id':  self.estudiante_id,
            'profesional_id': self.profesional_id,
            'tema':           self.tema,
            'estado':         self.estado,
            'created_at':     self.created_at.isoformat() if self.created_at else None,
            'estudiante':     self.estudiante.to_dict() if self.estudiante else None,
            'profesional':    self.profesional.to_dict() if self.profesional else None
        }