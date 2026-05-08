from app import db
from app.business.models.persona import Persona

class PersonaController:

    @staticmethod
    def get_all():
        personas = Persona.query.all()
        return [p.to_dict() for p in personas]

    @staticmethod
    def get_by_id(persona_id):
        persona = Persona.query.get_or_404(persona_id)
        return persona.to_dict()

    @staticmethod
    def get_by_firebase_uid(uid):
        persona = Persona.query.filter_by(firebase_uid=uid).first()
        if not persona:
            return {"error": "Persona no encontrada"}, 404
        return persona.to_dict()

    @staticmethod
    def update(persona_id, data):
        persona = Persona.query.get_or_404(persona_id)

        if 'nombre'   in data: persona.nombre   = data['nombre']
        if 'telefono' in data: persona.telefono = data['telefono']
        if 'foto_url' in data: persona.foto_url = data['foto_url']

        db.session.commit()
        return persona.to_dict()

    @staticmethod
    def delete(persona_id):
        persona = Persona.query.get_or_404(persona_id)
        db.session.delete(persona)
        db.session.commit()
        return {"mensaje": "Persona eliminada"}, 200