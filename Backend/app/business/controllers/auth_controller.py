import firebase_admin
from firebase_admin import credentials, auth
from app import db
from app.business.models.persona import Persona
from app.business.models.estudiante import Estudiante
from app.business.models.profesional import Profesional
import os

# Inicializar Firebase Admin solo una vez
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
KEY_PATH = os.path.join(BASE_DIR, os.environ.get('FIREBASE_CREDENTIALS'))

if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

class AuthController:

    @staticmethod
    def login(data):
        token = data.get('token')
        rol   = data.get('rol')  # 'estudiante' | 'profesional'

        if not token:
            return {"error": "Token requerido"}, 400
        if rol not in ['estudiante', 'profesional']:
            return {"error": "Rol inválido"}, 400

        try:
            # Firebase verifica el token y nos devuelve los datos del usuario
            decoded = auth.verify_id_token(token)
        except Exception:
            return {"error": "Token inválido o expirado"}, 401

        firebase_uid = decoded.get('uid')
        nombre       = decoded.get('name', 'Sin nombre')
        correo       = decoded.get('email', '')
        foto_url     = decoded.get('picture', None)

        # Buscar si la persona ya existe
        persona = Persona.query.filter_by(firebase_uid=firebase_uid).first()

        if not persona:
            # Primera vez — crear persona y su perfil según rol
            persona = Persona(
                firebase_uid=firebase_uid,
                nombre=nombre,
                correo=correo,
                foto_url=foto_url,
                rol=rol
            )
            db.session.add(persona)
            db.session.flush()  # para obtener el id antes del commit

            if rol == 'estudiante':
                db.session.add(Estudiante(persona_id=persona.id))
            else:
                db.session.add(Profesional(persona_id=persona.id))

            db.session.commit()

        return {
            "mensaje": "Login exitoso",
            "persona": persona.to_dict()
        }, 200

    @staticmethod
    def verify_token(token):
        """Utilitario para verificar token desde otras partes del backend"""
        try:
            decoded = auth.verify_id_token(token)
            return decoded
        except Exception:
            return None