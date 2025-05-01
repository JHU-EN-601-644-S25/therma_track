import hashlib, bcrypt, csv, io, base64
from flask import Blueprint, request, jsonify, Response
from sqlalchemy import text
from PIL import Image
from datetime import datetime, timedelta, timezone
from models import DoctorPatient, AuditLog
from db import db
from io import StringIO
import pyotp, qrcode


router = Blueprint("router", __name__)
DATABASE = "flask_database.db"

def setup_routes(app):
    
    def log_audit(user_id, action, status, details=""):
        try:
            entry = AuditLog(user_id=user_id, action=action, status=status, details=details)
            db.session.add(entry)
            db.session.commit()
        except Exception as e:
            print(f"[AUDIT LOGGING ERROR]: {e}")
            

    @app.route("/temperature", methods=["POST"])
    def temperature():
        data = request.get_json()
        viewer_id = data.get("viewer_id", -1)
        patient_id = data.get("patient_id", -1)
            
        try:
            query = text(
                "SELECT timestamp, temperature FROM Temperature WHERE patient_id = :patient_id"
            )

            try:
                log_audit(
                viewer_id, "view_temperature", "success", f"Viewed patient {patient_id}")
            except Exception as e:
                print("[AUDIT ERROR]", e)
            
            result = db.session.execute(query, {"patient_id": patient_id})
            data = result.fetchall()
            response = [{
                    "timestamp": ts.isoformat(),
                    "temperature": temp
                } for (ts, temp) in data if ts]
            return jsonify(response)    
        except Exception as e:
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
            # Fetch user details
            query = text("SELECT * FROM Users WHERE username = :username")
            result = db.session.execute(query, {"username": username})
            user = result.fetchone()

            if not user:
                log_audit(None, "attempts login", "fail", f"invalid username: {username}")
                return (jsonify({"message": "Invalid username or password"}),200,)

            user_id, username = user[0], user[1]
            hashed_password = user[2]
            failed_attempts = user[6] or 0
            account_locked_until = user[7]
            
            now = datetime.now(timezone.utc)
            
            if account_locked_until and account_locked_until > now:
                return jsonify({"message": "Account is locked. Try again later."}), 200

            if not bcrypt.checkpw(password.encode(), hashed_password.encode()):
                failed_attempts += 1
                if failed_attempts >= 5:
                    locked_until = (now + timedelta(minutes=15)).replace(tzinfo=timezone.utc)
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

            db.session.execute(
                text("""
                    UPDATE Users
                    SET failed_attempts = 0, account_locked_until = NULL, last_login = :now
                    WHERE user_id = :user_id
                """),
                {
                    "now": now.replace(tzinfo=timezone.utc),
                    "user_id": user_id
                }
            )
            db.session.commit()

            if not user[-1]:
                secret = pyotp.random_base32()
                db.session.execute(
                text("""
                    UPDATE Users
                    SET user_secret = :user_secret
                    WHERE user_id = :user_id
                    """
                    ),
                    {
                    "user_secret": secret,
                    "user_id": user_id
                    }
                )
                db.session.commit()
                totp_uri = pyotp.TOTP(secret).provisioning_uri(
                name=username, 
                issuer_name=f"ThermaTRack_{user_id}"
                )
                img = qrcode.make(totp_uri)
                img = img.resize((200, 200), Image.LANCZOS)
                buffer = io.BytesIO()
                img.save(buffer, format="PNG")
                qr_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            else:
                qr_base64 = None

            log_audit(user_id, "attempts login", "success")

            return jsonify({"message": None, "id": user_id, "user_type": user[5], "qr_code": (f"data:image/png;base64,{qr_base64}" if qr_base64 else None)}), 200
            
        except Exception as e:
            return (jsonify({"message": "Database error"}),500)


    @router.route("/login_checker", methods=["POST"])
    def login_checker():
        data = request.get_json()
        user_id = data.get("user_id", "")
        user_input_code = data.get("input_code", "").strip()
        try:
            result = db.session.execute(
                    text("""
                        SELECT * FROM Users WHERE user_id =:user_id
                        """),
                        {
                        "user_id": user_id
                        }
                    )
            user = result.fetchall()[0]
            user_secret = user[-1]
            totp = pyotp.TOTP(user_secret)
            is_valid = totp.verify(user_input_code)

            if is_valid:
                try:
                    log_audit(user_id, "attempts login", "success", "")
                except Exception as e:
                    print("[AUDIT ERROR]", e)

            else:
                try:
                    log_audit(user_id, "attempts login", "fail", "incorrect authentication")
                except Exception as e:
                    print("[AUDIT ERROR]", e)

            return jsonify({"auth_check": is_valid}), 200

        except Exception as e:
            return jsonify({"message": f"Database error: {e}"}), 500


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

    @router.route("/doctor/check_connect_patient", methods=["POST"])
    def doctor_check_connect_patient():
        data = request.get_json()
        doctor_id = data.get("doctor_id", None)
        patient_id = data.get("patient_id", None)
        year = data.get("year", None)
        month = data.get("month", None)
        day = data.get("day", None)

        try:
            result = db.session.execute(
                text("SELECT * FROM Users WHERE user_id = :user_id AND user_type = 0"),
                {"user_id": patient_id},
            )
            p_data = result.fetchone()
            if p_data is None:

                try:
                    log_audit(
                        doctor_id,
                        "connect patient",
                        "fail",
                        f"attempt to connect to invalid id {patient_id}",
                    )
                except Exception as e:
                    print("[AUDIT ERROR]", e)

                return jsonify({"message": "Invalid patient ID"}), 200
            
            dob_data = p_data[4]
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

                try:
                    log_audit(
                        doctor_id,
                        "connect patient",
                        "fail",
                        f"invalid information for {patient_id}",
                    )
                except Exception as e:
                    print("[AUDIT ERROR]", e)

                return jsonify({"message": "Invalid patient information"}), 200

            query = db.session.execute(
                text("SELECT * FROM DoctorPatients WHERE doctor_id = :doctor_id AND patient_id = :patient_id"),
                {"doctor_id": doctor_id, 
                 "patient_id": patient_id},
            )

            connect_data = query.fetchone()
            if connect_data is not None:

                try:
                    log_audit(
                        doctor_id,
                        "connect patient",
                        "fail",
                        f"doctor attempts to reconnect to {patient_id}",
                    )
                except Exception as e:
                    print("[AUDIT ERROR]", e)

                return jsonify({"message": "Patient already connected"}), 200
            return jsonify({"message": None, "patient_name": p_data[1]}), 200
        except Exception as e:
            return jsonify({"message": "Database error"}), 500

    @router.route("/doctor/connect_patient", methods=["POST"])
    def doctor_add_patient():
        data = request.get_json()
        doctor_id = data.get("doctor_id", None)
        patient_id = data.get("patient_id", None)

        # need to first check if the attempted connect is a patient
        try:
            db.session.execute(
                text("INSERT INTO DoctorPatients (doctor_id, patient_id) VALUES (:doctor_id, :patient_id)"),
                {
                    "doctor_id": doctor_id, 
                    "patient_id": patient_id},
            )
            db.session.commit()

            try:
                log_audit(
                    doctor_id,
                    "connect patient",
                    "success",
                    f"connect to patient {patient_id}",
                )
            except Exception as e:
                print("[AUDIT ERROR]", e)

            return jsonify({"message": None}), 200
        except Exception as e:
            return jsonify({"message": "Database error"}), 500
        
        
    @router.route("/logs", methods=["GET"])
    def view_logs():
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
        logs = [
            {
                "log_id": r[0],
                "user_id": r[1],
                "action": r[2],
                "status": r[3],
                "timestamp": r[4].isoformat(),
                "details": r[5]
            }
            for r in rows
        ]
        return jsonify(logs)

    # 
    @router.route("/logs/download", methods=["GET"])
    def download_logs_csv():
        result = db.session.execute(text("""
            SELECT log_id, user_id, action, status, timestamp, details
            FROM AuditLogs
            ORDER BY timestamp DESC
        """))
        rows = result.fetchall()

        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["log_id", "user_id", "action", "status", "timestamp", "details"])
        for r in rows:
            writer.writerow([r[0], r[1], r[2], r[3], r[4].isoformat(), r[5]])

        response = Response(output.getvalue(), mimetype="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=audit_logs.csv"
        return response

    app.register_blueprint(router)
