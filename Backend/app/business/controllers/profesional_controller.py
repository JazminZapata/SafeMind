from app import db
from app.business.models.profesional import Profesional

class ProfesionalController:

    @staticmethod
    def get_all():
        profesionales = Profesional.query.all()
        return [p.to_dict() for p in profesionales]

    @staticmethod
    def get_by_id(profesional_id):
        profesional = Profesional.query.get_or_404(profesional_id)
        return profesional.to_dict()

    @staticmethod
    def update(profesional_id, data):
        profesional = Profesional.query.get_or_404(profesional_id)

        if 'especialidad' in data: profesional.especialidad = data['especialidad']

        db.session.commit()
        return profesional.to_dict()

    @staticmethod
    def update_disponibilidad(profesional_id, disponibilidad):
        """Reemplaza toda la disponibilidad JSON de una vez"""
        profesional = Profesional.query.get_or_404(profesional_id)
        profesional.disponibilidad = disponibilidad
        db.session.commit()
        return profesional.to_dict()