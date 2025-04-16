import sqlite3, hashlib, io, base64
from flask import Blueprint, request, jsonify
import pyotp
import qrcode
from PIL import Image

router = Blueprint("router", __name__)
DATABASE = "flask_database.db"


@router.route("/temperature/<int:patient_id>", methods=["GET"])
def temperature(patient_id):
    try:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT time_logged, temp_data FROM Temperatures WHERE patient_id = ?",
            (patient_id,),
        )
        data = cursor.fetchall()
        connection.close()
        return jsonify(
            [
                {"time_logged": data_instance[0], "temp_data": data_instance[1]}
                for data_instance in data
            ]
        )

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
        # Fetch user details
        cursor.execute("SELECT * FROM Users WHERE username = ?", (username,))
        user = cursor.fetchone()

        # the data is passed in with format (username, user_id, user_password, last_login, dob, user_type)
        if user is None or hashlib.sha256(password.encode()).hexdigest() != user[2]:
            return jsonify({"message": "Invalid username or password"}), 200

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
        else:
            qr_base64 = None

        # Update last login timestamp
        cursor.execute(
            "UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
            (user[0],),
        )
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

    # need to first check if the attempted connect is a patient
    try:
        cursor.execute(
            "SELECT * FROM Users WHERE user_id = ? AND user_type = 0",
            (patient_id,),
        )
        p_data = cursor.fetchone()
        if p_data is None:
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
            return jsonify({"message": "Invalid patient information"}), 200

        cursor.execute(
            "SELECT * FROM DoctorPatients WHERE doctor_id = ? AND patient_id = ?",
            (doctor_id, patient_id),
        )

        connect_data = cursor.fetchone()
        if connect_data is not None:
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
        return jsonify({"message": None}), 200
    except sqlite3.Error:
        return jsonify({"message": "Database error"}), 500
    finally:
        connection.close()


from app import app

app.register_blueprint(router, url_prefix="/")
