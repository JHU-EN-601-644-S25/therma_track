<<<<<<< HEAD
import hashlib, random, string, bcrypt, csv
from flask import Blueprint, request, jsonify, Response
#from flask_security import auth_required
#from flask_mail import Mail, Message
from sqlalchemy import text
from config_db import config_db
from datetime import datetime, timedelta, timezone
from models import DoctorPatient, AuditLog
from db import db
from io import StringIO
=======
import hashlib, random, string
from flask import Blueprint, request, jsonify
from flask_security import auth_required
from flask_mail import Mail, Message
from sqlalchemy import text
from config_db import config_db
from datetime import datetime
from models import DoctorPatient
from db import db
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

router = Blueprint("router", __name__)
DATABASE = "flask_database.db"


def setup_routes(app):

<<<<<<< HEAD
    #mail = Mail(app)
    app.register_blueprint(router)
    
    def log_audit(user_id, action, status, details=""):
        try:
            entry = AuditLog(user_id=user_id, action=action, status=status, details=details)
            db.session.add(entry)
            db.session.commit()
        except Exception as e:
            print(f"[AUDIT LOGGING ERROR]: {e}")
            
=======
    mail = Mail(app)
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

    @app.route("/temperature/<int:patient_id>", methods=["GET"])
    def temperature(patient_id):
        try:
            query = text(
<<<<<<< HEAD
                "SELECT timestamp, temp_data, hash_value FROM Temperature WHERE patient_id = :patient_id"
            )
            result = db.session.execute(query, {"patient_id": patient_id})
            data = result.fetchall()
            response = []
            for row in data:
                ts, temp, stored_hash = row
                expected = hashlib.sha256(f"{ts.isoformat()}|{temp}|{patient_id}".encode()).hexdigest()
                if stored_hash == expected:
                    response.append({
                        "timestamp": ts.isoformat(),
                        "temperature": temp
                    })
            return jsonify(response)    
=======
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
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
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
<<<<<<< HEAD
            
=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

    @app.route("/login", methods=["POST"])
    def login_patient():
        data = request.get_json()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

<<<<<<< HEAD
        #code = "".join(random.choices(string.digits, k=6))
        #msg = Message("Your 2FA Code", recipients=["zhihan.xia.2172@gmail.com"])
        #msg.body = f"Thank you for using Therma Track!\nYour 2FA code is: {code}"
        #mail.send(msg)
=======
        code = "".join(random.choices(string.digits, k=6))
        msg = Message("Your 2FA Code", recipients=["zhihan.xia.2172@gmail.com"])
        msg.body = f"Thank you for using Therma Track!\nYour 2FA code is: {code}"
        mail.send(msg)
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

        try:
            # Fetch user details
            query = text("SELECT * FROM Users WHERE username = :username")
            result = db.session.execute(query, {"username": username})
            user = result.fetchone()

            # the data is passed in with format (username, user_id, user_password, last_login, dob, user_type)
<<<<<<< HEAD
            if not user:
                log_audit(None, "attempts login", "fail", f"invalid username: {username}")
                return (jsonify({"message": "Invalid username or password"}),200,)

            user_id = user["user_id"]
            hashed_password = user["user_password"]
            failed_attempts = user["failed_attempts"] or 0
            account_locked_until = user["account_locked_until"]
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

            log_audit(user_id, "attempts login", "success")

            return jsonify({"message": None, "id": user[0], "user_type": user[4]}), 200
            
        except Exception as e:
            print(f"Error at log in: {e}")
            return (jsonify({"message": "Database error"}),500)
=======
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
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

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
<<<<<<< HEAD
        
        
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
=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
