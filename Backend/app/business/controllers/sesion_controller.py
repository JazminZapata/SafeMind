from app import db
from app.business.models.sesion import Sesion

class SesionController:

    @staticmethod
    def get_all():
        sesiones = Sesion.query.all()
        return [s.to_dict() for s in sesiones]

    @staticmethod
    def get_by_id(sesion_id):
        sesion = Sesion.query.get_or_404(sesion_id)
        return sesion.to_dict()

    @staticmethod
    def get_by_estudiante(estudiante_id):
        sesiones = Sesion.query.filter_by(estudiante_id=estudiante_id).all()
        return [s.to_dict() for s in sesiones]

    @staticmethod
    def get_by_profesional(profesional_id):
        sesiones = Sesion.query.filter_by(profesional_id=profesional_id).all()
        return [s.to_dict() for s in sesiones]

    @staticmethod
    def create(data):
        nueva = Sesion(
            estudiante_id  = data.get('estudiante_id'),
            profesional_id = data.get('profesional_id'),
            tema           = data.get('tema', ''),
            estado         = 'activa'
        )
        db.session.add(nueva)
        db.session.commit()
        return nueva.to_dict(), 201

    @staticmethod
    def cerrar(sesion_id):
        sesion = Sesion.query.get_or_404(sesion_id)
        sesion.estado = 'cerrada'
        db.session.commit()
        return sesion.to_dict()