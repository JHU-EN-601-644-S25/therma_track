import sqlite3, hashlib, io, base64, bcrypt
from flask import Blueprint, request, jsonify
import pyotp
import qrcode
from PIL import Image
from datetime import datetime, timedelta, timezone

router = Blueprint("router", __name__)
DATABASE = "flask_database.db"


@router.route("/temperature", methods=["POST"])
def temperature():
    data = request.get_json()
    viewer_id = data.get("viewer_id", -1)
    patient_id = data.get("patient_id", -1)
    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT time_logged, temp_data, hash_value FROM Temperatures WHERE patient_id = ?",
            (patient_id,),
        )
        data = cursor.fetchall()
        connection.close()

        try:
            log_audit(
                viewer_id, "view_temperature", "success", f"Viewed patient {patient_id}"
            )
        except Exception as e:
            print("[AUDIT ERROR]", e)

        result = []
        for idx, row in enumerate(data):
            ts, temp, stored_hash = row
            expected = hashlib.sha256(f"{ts}|{temp}|{patient_id}".encode()).hexdigest()
            if stored_hash == expected:
                result.append({"timestamp": ts, "temperature": temp})

        return jsonify(result)

    except sqlite3.Error:
        return (
            jsonify(
                {
                    "message": "Unable to find the corresponding data at the time. Please try again later"
                }
            ),
            500,
        )


@router.route("/login", methods=["POST"])
def login_patient():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    try:

        cursor.execute("SELECT * FROM Users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({"message": "Invalid username or password"}), 200

        username, user_id, hashed_pswd = user[0], user[1], user[2]
        failed_attempts, account_locked_until = user[6], user[7]
        now = datetime.now()

        if account_locked_until:
            try:
                locked_time = datetime.strptime(
                    account_locked_until, "%Y-%m-%d %H:%M:%S"
                )
                if now < locked_time:
                    try:
                        log_audit(
                            user_id,
                            "attempts login",
                            "fail",
                            "attempt to access when account locked",
                        )
                    except Exception as e:
                        print("[AUDIT ERROR]", e)

                    return (
                        jsonify({"message": "Account is locked. Try again later."}),
                        200,
                    )
            except:
                pass

        if not bcrypt.checkpw(password.encode(), hashed_pswd.encode()):
            failed_attempts += 1
            if failed_attempts >= 5:
                lock_until = (now + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute(
                    "UPDATE Users SET failed_attempts = ?, account_locked_until = ? WHERE user_id = ?",
                    (failed_attempts, lock_until, user_id),
                )
                connection.commit()

                try:
                    log_audit(
                        user_id,
                        "attempts login",
                        "fail",
                        "too many failed attempts. account locked",
                    )
                except Exception as e:
                    print("[AUDIT ERROR]", e)

                return (
                    jsonify(
                        {"message": "Account locked due to too many failed attempts."}
                    ),
                    200,
                )
            else:
                cursor.execute(
                    "UPDATE Users SET failed_attempts = ? WHERE user_id = ?",
                    (failed_attempts, user_id),
                )
                connection.commit()

                try:
                    log_audit(
                        user_id,
                        "attempts login",
                        "fail",
                        f"incorrect password. Failed attempt #{failed_attempts}",
                    )
                except Exception as e:
                    print("[AUDIT ERROR]", e)
                return jsonify({"message": "Invalid username or password"}), 200

        cursor.execute(
            "UPDATE Users SET failed_attempts = 0, account_locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
            (user_id,),
        )

        try:
            log_audit(
                user_id, "attempts login", "intermediate", "corretly inputted password"
            )
        except Exception as e:
            print("[AUDIT ERROR]", e)

        if not user[-1]:
            # generate
            secret = pyotp.random_base32()
            cursor.execute(
                "UPDATE Users SET user_secret = ? WHERE user_id = ?",
                (
                    secret,
                    user[1],
                ),
            )
            # generate a QR code for Google Authenticator
            totp_uri = pyotp.TOTP(secret).provisioning_uri(
                name=user[-2], issuer_name=f"ThermaTrack_{user[0]}"
            )

            img = qrcode.make(totp_uri)
            img = img.resize((200, 200), Image.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            qr_base64 = base64.b64encode(buffer.getvalue()).decode()

            try:
                log_audit(
                    user_id, "attempts login", "intermediate", "system generate QR code"
                )
            except Exception as e:
                print("[AUDIT ERROR]", e)

        else:
            qr_base64 = None

        connection.commit()

        return (
            jsonify(
                {
                    "message": None,
                    "id": user[1],
                    "user_type": user[5],
                    "qr_code": (
                        f"data:image/png;base64,{qr_base64}" if qr_base64 else None
                    ),
                }
            ),
            200,
        )
    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500
    finally:
        connection.close()


@router.route("/login_checker", methods=["POST"])
def login_checker():
    data = request.get_json()
    user_id = data.get("user_id", "")
    user_input_code = data.get("input_code", "").strip()
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
        user = cursor.fetchone()

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

    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500
    finally:
        connection.close()


@router.route("/doctor/check_patient/<int:doctor_id>", methods=["GET"])
def doctor_check_patient(doctor_id):
    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT patient_id FROM DoctorPatients WHERE doctor_id = ?",
            (doctor_id,),
        )
        data = cursor.fetchall()
        patient_data = []
        # get patient details
        for (pid,) in data:
            cursor.execute(
                "SELECT * FROM Users WHERE user_id = ?",
                (pid,),
            )
            p_data = cursor.fetchone()
            patient_data.append({"patient_id": p_data[1], "username": p_data[0]})
        connection.close()
        return jsonify(patient_data)
    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500


@router.route("/doctor/check_connect_patient", methods=["POST"])
def doctor_check_connect_patient():
    data = request.get_json()
    doctor_id = data.get("doctor_id", None)
    patient_id = data.get("patient_id", None)
    year = data.get("year", None)
    month = data.get("month", None)
    day = data.get("day", None)

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT * FROM Users WHERE user_id = ? AND user_type = 0",
            (patient_id,),
        )
        p_data = cursor.fetchone()
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
        dob_data = p_data[4].split()[0]
        dob_arr = dob_data.split("-")
        expected_year, expected_month, expected_day = (
            int(dob_arr[0]),
            int(dob_arr[1]),
            int(dob_arr[2]),
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

        cursor.execute(
            "SELECT * FROM DoctorPatients WHERE doctor_id = ? AND patient_id = ?",
            (doctor_id, patient_id),
        )

        connect_data = cursor.fetchone()
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

        return jsonify({"message": None, "patient_name": p_data[0]}), 200
    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500
    finally:
        connection.close()


@router.route("/doctor/connect_patient", methods=["POST"])
def doctor_add_patient():
    data = request.get_json()
    doctor_id = data.get("doctor_id", None)
    patient_id = data.get("patient_id", None)

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    # need to first check if the attempted connect is a patient
    try:
        cursor.execute(
            "INSERT INTO DoctorPatients (doctor_id, patient_id) VALUES (?, ?)",
            (doctor_id, patient_id),
        )
        connection.commit()

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
    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500
    finally:
        connection.close()


def log_audit(user_id, action, status, details=""):
    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO AuditLogs (user_id, action, status, details)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, action, status, details),
        )
        connection.commit()
        connection.close()
    except Exception as e:
        print(f"[AUDIT LOGGING ERROR]: {e}")


@router.route("/logs", methods=["GET"])
def view_logs():
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 50))
        offset = (page - 1) * limit

        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT log_id, user_id, action, status, timestamp, details
            FROM AuditLogs
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        )
        rows = cursor.fetchall()
        connection.close()

        logs = []
        for row in rows:
            logs.append(
                {
                    "log_id": row[0],
                    "user_id": row[1],
                    "action": row[2],
                    "status": row[3],
                    "timestamp": row[4],
                    "details": row[5],
                }
            )
        return jsonify(logs)
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to fetch logs"}), 500


@router.route("/logs/download", methods=["GET"])
def download_logs_csv():
    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT log_id, user_id, action, status, timestamp, details
            FROM AuditLogs
            ORDER BY timestamp DESC
            """,
        )
        rows = cursor.fetchall()
        connection.close()

        import csv
        from io import StringIO
        from flask import Response

        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["log_id", "user_id", "action", "status", "timestamp", "details"]
        )
        writer.writerows(rows)

        response = Response(output.getvalue(), mimetype="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=audit_logs.csv"
        return response
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to generate CSV"}), 500


from app import app

app.register_blueprint(router, url_prefix="/")
