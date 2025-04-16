import hashlib, random, string
from flask import Blueprint, request, jsonify
from flask_security import auth_required
from flask_mail import Mail, Message
from sqlalchemy import text
from config_db import config_db
from datetime import datetime
from models import DoctorPatient
from db import db

router = Blueprint("router", __name__)
DATABASE = "flask_database.db"


def setup_routes(app):

    mail = Mail(app)

    @app.route("/temperature/<int:patient_id>", methods=["GET"])
    def temperature(patient_id):
        try:
            query = text(
                "SELECT timestamp, temp_data FROM Temperature WHERE patient_id = :patient_id"
            )
            result = db.session.execute(query, {"patient_id": patient_id})
            data = result.fetchall()
            return jsonify(
                [
                    {"timestamp": row[0].isoformat(), "temperature": row[1]}
                    for row in data
                ]
            )
        except Exception as e:
            print(e)
            return (
                jsonify(
                    {
                        "message": "Unable to find the corresponding data at the time. Please try again later"
                    }
                ),
                500,
            )

    @app.route("/login", methods=["POST"])
    def login_patient():
        data = request.get_json()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        code = "".join(random.choices(string.digits, k=6))
        msg = Message("Your 2FA Code", recipients=["zhihan.xia.2172@gmail.com"])
        msg.body = f"Thank you for using Therma Track!\nYour 2FA code is: {code}"
        mail.send(msg)

        try:
            # Fetch user details
            query = text("SELECT * FROM Users WHERE username = :username")
            result = db.session.execute(query, {"username": username})
            user = result.fetchone()

            # the data is passed in with format (username, user_id, user_password, last_login, dob, user_type)
            if not user or hashlib.sha256(password.encode()).hexdigest() != user[2]:
                return (
                    jsonify(
                        {
                            "message": "Invalid username or password",
                            "id": None,
                            "user_type": None,
                        }
                    ),
                    200,
                )

            return jsonify({"message": code, "id": user[0], "user_type": user[4]}), 200
        except Exception as e:
            print(f"Error at log in: {e}")
            return (
                jsonify({"message": "Database error", "id": None, "user_type": None}),
                200,
            )

    @app.route("/doctor/check_patient/<int:doctor_id>", methods=["GET"])
    def doctor_check_patient(doctor_id):
        try:
            query01 = text(
                "SELECT patient_id FROM DoctorPatients WHERE doctor_id = :doctor_id"
            )
            result = db.session.execute(query01, {"doctor_id": doctor_id})
            data = result.fetchall()
            patient_data = []
            query02 = text("SELECT * FROM Users WHERE user_id = :user_id")
            for (pid,) in data:
                result = db.session.execute(query02, {"user_id": pid})
                p_data = result.fetchone()
                patient_data.append({"patient_id": p_data[0], "username": p_data[1]})
            return jsonify(patient_data)
        except Exception:
            return jsonify({"message": "Database error"}), 500

    @app.route("/doctor/connect_patient", methods=["POST"])
    def doctor_add_patient():
        data = request.get_json()
        doctor_id = data.get("doctor_id", None)
        patient_id = data.get("patient_id", None)
        year = data.get("year", None)
        month = data.get("month", None)
        day = data.get("day", None)

        # need to first check if the attempted connect is a patient
        try:
            query01 = text(
                "SELECT * FROM Users WHERE user_id = :patient_id AND user_type = 0"
            )
            result = db.session.execute(query01, {"patient_id": patient_id})
            p_data = result.fetchone()
            if p_data is None:
                return jsonify({"message": "Invalid patient ID"}), 200
            dob_data = p_data[5]
            expected_year, expected_month, expected_day = (
                dob_data.year,
                dob_data.month,
                dob_data.day,
            )
            if (
                (year != expected_year)
                or (month != expected_month)
                or (day != expected_day)
            ):
                return jsonify({"message": "Invalid patient information"}), 200
            query02 = text(
                "SELECT * FROM DoctorPatients WHERE doctor_id = :doctor_id AND patient_id = :patient_id"
            )
            result = db.session.execute(
                query02, {"doctor_id": doctor_id, "patient_id": patient_id}
            )
            connect_data = result.fetchone()
            if connect_data is not None:
                return jsonify({"message": "Patient already connected"}), 200
            with app.app_context():
                db.session.add(
                    DoctorPatient(doctor_id=doctor_id, patient_id=patient_id)
                )
            db.session.commit()
            return jsonify({"message": None}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Database error"}), 500
