from app import db
from datetime import datetime

class Profesional(db.Model):
    __tablename__ = 'profesionales'

    id            = db.Column(db.Integer, primary_key=True)
    persona_id    = db.Column(db.Integer, db.ForeignKey('personas.id'), nullable=False)
    especialidad  = db.Column(db.String(100), nullable=True)
    disponibilidad = db.Column(db.JSON, nullable=True)
    # Ejemplo de disponibilidad:
    # {
    #   "lunes":    "8:00 - 12:00",
    #   "miercoles":"14:00 - 18:00",
    #   "viernes":  "9:00 - 11:00"
    # }

    # Relaciones
    persona  = db.relationship('Persona', back_populates='profesional')
    sesiones = db.relationship('Sesion', back_populates='profesional',
                               cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Profesional {self.id}>'

    def to_dict(self):
        return {
            'id':             self.id,
            'persona_id':     self.persona_id,
            'especialidad':   self.especialidad,
            'disponibilidad': self.disponibilidad,
            'persona':        self.persona.to_dict() if self.persona else None
        }