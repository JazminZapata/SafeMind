from app import create_app, db
from app.business.models.persona import Persona
from app.business.models.profesional import Profesional
from app.business.models.estudiante import Estudiante

app = create_app()

with app.app_context():
    # Limpiar datos existentes
    db.session.query(Profesional).delete()
    db.session.query(Estudiante).delete()
    db.session.query(Persona).delete()
    db.session.commit()

    print("🌱 Creando profesionales...")

    profesionales = [
        {
            "firebase_uid": "prof_001",
            "nombre": "Dra. Maria Garcia",
            "correo": "maria.garcia@safemind.com",
            "telefono": "+57 300 123 4567",
            "foto_url": "",
            "rol": "profesional",
            "especialidad": "Psicologia Clinica",
            "disponibilidad": {
                "lunes": "8:00 - 12:00",
                "miercoles": "14:00 - 18:00",
                "viernes": "9:00 - 13:00"
            }
        },
        {
            "firebase_uid": "prof_002",
            "nombre": "Dr. Carlos Lopez",
            "correo": "carlos.lopez@safemind.com",
            "telefono": "+57 301 234 5678",
            "foto_url": "",
            "rol": "profesional",
            "especialidad": "Coaching Academico",
            "disponibilidad": {
                "martes": "9:00 - 13:00",
                "jueves": "15:00 - 19:00"
            }
        },
        {
            "firebase_uid": "prof_003",
            "nombre": "Lic. Ana Martinez",
            "correo": "ana.martinez@safemind.com",
            "telefono": "+57 302 345 6789",
            "foto_url": "",
            "rol": "profesional",
            "especialidad": "Orientacion Vocacional",
            "disponibilidad": {
                "lunes": "14:00 - 18:00",
                "viernes": "8:00 - 12:00"
            }
        },
        {
            "firebase_uid": "prof_004",
            "nombre": "Dr. Roberto Sanchez",
            "correo": "roberto.sanchez@safemind.com",
            "telefono": "+57 303 456 7890",
            "foto_url": "",
            "rol": "profesional",
            "especialidad": "Terapia Cognitivo-Conductual",
            "disponibilidad": {
                "martes": "8:00 - 12:00",
                "miercoles": "8:00 - 12:00",
                "jueves": "8:00 - 12:00"
            }
        },
        {
            "firebase_uid": "prof_005",
            "nombre": "Lic. Laura Ramirez",
            "correo": "laura.ramirez@safemind.com",
            "telefono": "+57 304 567 8901",
            "foto_url": "",
            "rol": "profesional",
            "especialidad": "Psicopedagogia",
            "disponibilidad": {
                "lunes": "9:00 - 13:00",
                "miercoles": "9:00 - 13:00"
            }
        }
    ]

    for p in profesionales:
        persona = Persona(
            firebase_uid=p["firebase_uid"],
            nombre=p["nombre"],
            correo=p["correo"],
            telefono=p["telefono"],
            foto_url=p["foto_url"],
            rol=p["rol"]
        )
        db.session.add(persona)
        db.session.flush()

        profesional = Profesional(
            persona_id=persona.id,
            especialidad=p["especialidad"],
            disponibilidad=p["disponibilidad"]
        )
        db.session.add(profesional)

    db.session.commit()
    print("✅ 5 profesionales creados exitosamente")
    print("🌐 Ve a http://127.0.0.1:5000/profesionales para verificar")