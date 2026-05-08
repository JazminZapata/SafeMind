from app import db
from datetime import datetime

class Estudiante(db.Model):
    __tablename__ = 'estudiantes'

    id         = db.Column(db.Integer, primary_key=True)
    persona_id = db.Column(db.Integer, db.ForeignKey('personas.id'), nullable=False)
    institucion = db.Column(db.String(150), nullable=True)
    carrera    = db.Column(db.String(100), nullable=True)
    horario    = db.Column(db.JSON, nullable=True)
    # Ejemplo de horario:
    # {
    #   "lunes":    ["8:00 Cálculo", "10:00 Inglés"],
    #   "martes":   ["9:00 Programación"],
    #   "miercoles":[]
    # }

    # Relaciones
    persona  = db.relationship('Persona', back_populates='estudiante')
    sesiones = db.relationship('Sesion', back_populates='estudiante',
                               cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Estudiante {self.id}>'

    def to_dict(self):
        return {
            'id':          self.id,
            'persona_id':  self.persona_id,
            'institucion': self.institucion,
            'carrera':     self.carrera,
            'horario':     self.horario,
            'persona':     self.persona.to_dict() if self.persona else None
        }