from app import db
from app.business.models.mensaje import Mensaje

class MensajeController:

    @staticmethod
    def get_by_sesion(sesion_id):
        mensajes = Mensaje.query.filter_by(sesion_id=sesion_id)\
                                .order_by(Mensaje.created_at.asc()).all()
        return [m.to_dict() for m in mensajes]

    @staticmethod
    def create(data):
        nuevo = Mensaje(
            sesion_id    = data.get('sesion_id'),
            remitente_id = data.get('remitente_id'),
            contenido    = data.get('contenido')
        )
        db.session.add(nuevo)
        db.session.commit()
        return nuevo.to_dict(), 201

    @staticmethod
    def delete(mensaje_id):
        mensaje = Mensaje.query.get_or_404(mensaje_id)
        db.session.delete(mensaje)
        db.session.commit()
        return {"mensaje": "Mensaje eliminado"}, 200