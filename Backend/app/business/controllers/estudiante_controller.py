from app import db
from app.business.models.estudiante import Estudiante

class EstudianteController:

    @staticmethod
    def get_all():
        estudiantes = Estudiante.query.all()
        return [e.to_dict() for e in estudiantes]

    @staticmethod
    def get_by_id(estudiante_id):
        estudiante = Estudiante.query.get_or_404(estudiante_id)
        return estudiante.to_dict()

    @staticmethod
    def get_by_persona_id(persona_id):
        """Busca el estudiante usando el id de la tabla personas"""
        estudiante = Estudiante.query.filter_by(persona_id=persona_id).first()
        if not estudiante:
            return {"error": "Estudiante no encontrado"}, 404
        return estudiante.to_dict()

    @staticmethod
    def update(estudiante_id, data):
        estudiante = Estudiante.query.get_or_404(estudiante_id)

        if 'institucion' in data: estudiante.institucion = data['institucion']
        if 'carrera'     in data: estudiante.carrera     = data['carrera']

        db.session.commit()
        return estudiante.to_dict()

    @staticmethod
    def update_horario(estudiante_id, horario):
        """Reemplaza todo el horario JSON de una vez"""
        estudiante = Estudiante.query.get_or_404(estudiante_id)
        estudiante.horario = horario
        db.session.commit()
        return estudiante.to_dict()