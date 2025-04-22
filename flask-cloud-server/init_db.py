from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text, inspect
from config_db import config_db
<<<<<<< HEAD
from datetime import datetime, timedelta, timezone
import hashlib, random, bcrypt
=======
from datetime import datetime, timedelta
import hashlib, random
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
from models import User, TempLog


app, db = config_db()


def random_timestamp(mode):
    """Generate a random timestamp between start_date and end_date."""
    if mode == "init_user":
        start_date, end_date = "2023-01-01", "2023-02-01"
    elif mode == "dob":
        start_date, end_date = "1950-01-01", "2002-01-01"
    else:
        # data generated within 3 days
        start_date, end_date = "2025-02-01", "2025-02-03"

    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    random_time = start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds()))
    )
<<<<<<< HEAD
    return random_time.replace(tzinfo=timezone.utc)
=======
    return random_time.strftime("%Y-%m-%d %H:%M:%S")
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2


def initialize_patients():
    patient_commands = [
        (
            "sad_patient",
<<<<<<< HEAD
            bcrypt.hashpw("sad".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("sad".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "happy_patient",
<<<<<<< HEAD
            bcrypt.hashpw("happy".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("happy".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "stressed_patient",
<<<<<<< HEAD
            bcrypt.hashpw("stressed".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("stressed".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "sleepy_patient",
<<<<<<< HEAD
            bcrypt.hashpw("sleepy".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("sleepy".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
    ]

    with app.app_context():
        for patient_data in patient_commands:
            db.session.add(
                User(
                    username=patient_data[0],
                    user_password=patient_data[1],
                    last_login=patient_data[2],
                    dob=patient_data[3],
                    user_type=patient_data[4],
                )
            )
        db.session.commit()


def initialize_doctors():
    doctor_commands = [
        (
            "sad_doctor",
<<<<<<< HEAD
            bcrypt.hashpw("sad".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("sad".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "happy_doctor",
<<<<<<< HEAD
            bcrypt.hashpw("happy".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("happy".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "stressed_doctor",
<<<<<<< HEAD
            bcrypt.hashpw("stressed".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("stressed".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "sleepy_doctor",
<<<<<<< HEAD
            bcrypt.hashpw("sleepy".encode(), bcrypt.gensalt()).decode(),
=======
            hashlib.sha256("sleepy".encode()).hexdigest(),
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
    ]

    with app.app_context():
        for doctor_data in doctor_commands:
            db.session.add(
                User(
                    username=doctor_data[0],
                    user_password=doctor_data[1],
                    last_login=doctor_data[2],
                    dob=doctor_data[3],
                    user_type=doctor_data[4],
                )
            )
        db.session.commit()


def initialize_temperatures():
    data = []

    # ensure some has more than 50 instances
    for _ in range(205):
        random_patient = random.randint(1, 4)
        random_temperature = random.randint(35, 42)
        data.append(
            (
                random_patient,
                random_patient,
                random_temperature,
                random_timestamp(mode=""),
            )
        )

    with app.app_context():
        for instance in data:
            db.session.add(
                TempLog(
                    patient_id=instance[0],
                    device_id=instance[1],
                    temp_data=instance[2],
                    timestamp=instance[3],
                )
            )
        db.session.commit()


if __name__ == "__main__":
    initialize_patients()
    initialize_doctors()
    initialize_temperatures()
