from flask import Blueprint, jsonify, request
from app.business.controllers.auth_controller       import AuthController
from app.business.controllers.persona_controller    import PersonaController
from app.business.controllers.estudiante_controller import EstudianteController
from app.business.controllers.profesional_controller import ProfesionalController
from app.business.controllers.sesion_controller     import SesionController
from app.business.controllers.mensaje_controller    import MensajeController

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return "Backend funcionando"

# ─────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────
@main_bp.route('/auth/login', methods=['POST'])
def login():
    result, status = AuthController.login(request.json)
    return jsonify(result), status


# ─────────────────────────────────────────
# PERSONAS
# ─────────────────────────────────────────
@main_bp.route('/personas', methods=['GET'])
def get_personas():
    return jsonify(PersonaController.get_all())

@main_bp.route('/personas/', methods=['GET'])
def get_persona(id):
    return jsonify(PersonaController.get_by_id(id))

@main_bp.route('/personas/uid/', methods=['GET'])
def get_persona_by_uid(uid):
    result = PersonaController.get_by_firebase_uid(uid)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result)

@main_bp.route('/personas/', methods=['PUT'])
def update_persona(id):
    return jsonify(PersonaController.update(id, request.json))

@main_bp.route('/personas/', methods=['DELETE'])
def delete_persona(id):
    result, status = PersonaController.delete(id)
    return jsonify(result), status


# ─────────────────────────────────────────
# ESTUDIANTES
# ─────────────────────────────────────────
@main_bp.route('/estudiantes', methods=['GET'])
def get_estudiantes():
    return jsonify(EstudianteController.get_all())

@main_bp.route('/estudiantes/', methods=['GET'])
def get_estudiante(id):
    return jsonify(EstudianteController.get_by_id(id))

@main_bp.route('/estudiantes/', methods=['PUT'])
def update_estudiante(id):
    return jsonify(EstudianteController.update(id, request.json))

@main_bp.route('/estudiantes//horario', methods=['PUT'])
def update_horario(id):
    # Body: { "horario": { "lunes": ["8:00 Cálculo"], ... } }
    horario = request.json.get('horario')
    return jsonify(EstudianteController.update_horario(id, horario))


# ─────────────────────────────────────────
# PROFESIONALES
# ─────────────────────────────────────────
@main_bp.route('/profesionales', methods=['GET'])
def get_profesionales():
    return jsonify(ProfesionalController.get_all())

@main_bp.route('/profesionales/', methods=['GET'])
def get_profesional(id):
    return jsonify(ProfesionalController.get_by_id(id))

@main_bp.route('/profesionales/', methods=['PUT'])
def update_profesional(id):
    return jsonify(ProfesionalController.update(id, request.json))

@main_bp.route('/profesionales//disponibilidad', methods=['PUT'])
def update_disponibilidad(id):
    # Body: { "disponibilidad": { "lunes": "8:00 - 12:00", ... } }
    disponibilidad = request.json.get('disponibilidad')
    return jsonify(ProfesionalController.update_disponibilidad(id, disponibilidad))


# ─────────────────────────────────────────
# SESIONES
# ─────────────────────────────────────────
@main_bp.route('/sesiones', methods=['GET'])
def get_sesiones():
    return jsonify(SesionController.get_all())

@main_bp.route('/sesiones/', methods=['GET'])
def get_sesion(id):
    return jsonify(SesionController.get_by_id(id))

@main_bp.route('/sesiones/estudiante/', methods=['GET'])
def get_sesiones_estudiante(estudiante_id):
    return jsonify(SesionController.get_by_estudiante(estudiante_id))

@main_bp.route('/sesiones/profesional/', methods=['GET'])
def get_sesiones_profesional(profesional_id):
    return jsonify(SesionController.get_by_profesional(profesional_id))

@main_bp.route('/sesiones', methods=['POST'])
def create_sesion():
    result, status = SesionController.create(request.json)
    return jsonify(result), status

@main_bp.route('/sesiones//cerrar', methods=['PUT'])
def cerrar_sesion(id):
    return jsonify(SesionController.cerrar(id))


# ─────────────────────────────────────────
# MENSAJES
# ─────────────────────────────────────────
@main_bp.route('/sesiones//mensajes', methods=['GET'])
def get_mensajes(sesion_id):
    return jsonify(MensajeController.get_by_sesion(sesion_id))

@main_bp.route('/mensajes', methods=['POST'])
def create_mensaje():
    result, status = MensajeController.create(request.json)
    return jsonify(result), status

@main_bp.route('/mensajes/', methods=['DELETE'])
def delete_mensaje(id):
    result, status = MensajeController.delete(id)
    return jsonify(result), status