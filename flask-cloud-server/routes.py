import hashlib, bcrypt
from flask import Blueprint, request, jsonify, Response
from sqlalchemy import text
from config_db import config_db
from datetime import datetime, timedelta, timezone
from models import DoctorPatient, AuditLog
from db import db
import csv
from io import StringIO


router = Blueprint("router", __name__)
DATABASE = "flask_database.db"

def setup_routes(app):
    @app.route("/temperature/<int:patient_id>", methods=["GET"])
    def temperature(patient_id):
        try:
            query = text(
                "SELECT timestamp, temp_data FROM Temperature WHERE patient_id = :patient_id"
            )
            result = db.session.execute(query, {"patient_id": patient_id})
            data = result.fetchall()
            
            log_audit(None, "view_temperature", "success", f"Viewed patient {patient_id}")
            
            return jsonify(
                [{"timestamp": row[0].isoformat(), "temperature": row[1]} for row in data]
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

        try:
            query = text("SELECT * FROM Users WHERE username = :username")
            result = db.session.execute(query, {"username": username})
            user = result.fetchone()

            if not user:
                log_audit(None, "login", "fail", f"Username: {username}")
                return jsonify({"message": "Invalid username or password"}), 200

            user_id = user[0]
            hashed_password = user[2]
            failed_attempts = user[6] or 0
            account_locked_until = user[7]

            now = datetime.now(timezone.utc)

            # 
            if account_locked_until and account_locked_until > now:
                return jsonify({"message": "Account is locked. Try again later."}), 200

            # 
            if not bcrypt.checkpw(password.encode(), hashed_password.encode()):
                failed_attempts += 1
                if failed_attempts >= 5:
                    locked_until = now + timedelta(minutes=15)
                    db.session.execute(
                        text("""
                            UPDATE Users
                            SET failed_attempts = :failed_attempts, account_locked_until = :locked_until
                            WHERE user_id = :user_id
                        """),
                        {
                            "failed_attempts": failed_attempts,
                            "locked_until": locked_until,
                            "user_id": user_id
                        }
                    )
                    db.session.commit()
                    
                    return jsonify({"message": "Account locked due to too many failed attempts."}), 200
                else:
                    db.session.execute(
                        text("""
                            UPDATE Users
                            SET failed_attempts = :failed_attempts
                            WHERE user_id = :user_id
                        """),
                        {
                            "failed_attempts": failed_attempts,
                            "user_id": user_id
                        }
                    )
                    db.session.commit()
                    return jsonify({"message": "Invalid username or password"}), 200

            # 
            db.session.execute(
                text("""
                    UPDATE Users
                    SET failed_attempts = 0, account_locked_until = NULL, last_login = :now
                    WHERE user_id = :user_id
                """),
                {
                    "now": now,
                    "user_id": user_id
                }
            )
            db.session.commit()
            
            log_audit(user_id, "login", "success")

            return jsonify({"message": None, "id": user[0], "user_type": user[4]}), 200

        except Exception as e:
            print(f"Error at login: {e}")
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
                log_audit(doctor_id, "connect_patient", "fail", "Invalid patient ID")
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
                log_audit(doctor_id, "connect_patient", "fail", "DOB mismatch")
                return jsonify({"message": "Invalid patient information"}), 200
            query02 = text(
                "SELECT * FROM DoctorPatients WHERE doctor_id = :doctor_id AND patient_id = :patient_id"
            )
            result = db.session.execute(
                query02, {"doctor_id": doctor_id, "patient_id": patient_id}
            )
            connect_data = result.fetchone()
            if connect_data is not None:
                log_audit(doctor_id, "connect_patient", "fail", "Already connected")
                return jsonify({"message": "Patient already connected"}), 200
            with app.app_context():
                db.session.add(DoctorPatient(doctor_id=doctor_id, patient_id=patient_id))
            db.session.commit()
            
            log_audit(doctor_id, "connect_patient", "success", f"Connected patient {patient_id}")
            
            return jsonify({"message": None}), 200
        except Exception as e:
            print(e)
            log_audit(doctor_id, "connect_patient", "fail", "Database error")
            return jsonify({"message": "Database error"}), 50
        
        
    def log_audit(user_id, action, status, details=""):
        try:
            entry = AuditLog(user_id=user_id, action=action, status=status, details=details)
            db.session.add(entry)
            db.session.commit()
        except Exception as e:
            print(f"[AUDIT LOGGING ERROR]: {e}")
    
    
    @app.route("/logs", methods=["GET"])
    def view_logs():
        try:
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 50))
            offset = (page - 1) * limit

            result = db.session.execute(text("""
                SELECT log_id, user_id, action, status, timestamp, details
                FROM AuditLogs
                ORDER BY timestamp DESC
                LIMIT :limit OFFSET :offset
            """), {"limit": limit, "offset": offset})
            rows = result.fetchall()

            logs = []
            for row in rows:
                    logs.append({
                    "log_id": row[0],
                    "user_id": row[1],
                    "action": row[2],
                    "status": row[3],
                    "timestamp": row[4].isoformat(),
                    "details": row[5],
                })
            return jsonify(logs)
        except Exception as e:
            print(e)
            return jsonify({"message": "Failed to fetch logs"}), 500
        
        
    @app.route("/logs/download", methods=["GET"])
    def download_logs_csv():
        try:
            result = db.session.execute(text("""
                SELECT log_id, user_id, action, status, timestamp, details
                FROM AuditLogs
                ORDER BY timestamp DESC
            """))
            rows = result.fetchall()

            output = StringIO()
            writer = csv.writer(output)
            writer.writerow(["log_id", "user_id", "action", "status", "timestamp", "details"])
            for row in rows:
                writer.writerow([row[0], row[1], row[2], row[3], row[4].isoformat(), row[5]])

            response = Response(output.getvalue(), mimetype="text/csv")
            response.headers["Content-Disposition"] = "attachment; filename=audit_logs.csv"
            return response
        except Exception as e:
            print(e)
            return jsonify({"message": "Failed to generate CSV"}), 500