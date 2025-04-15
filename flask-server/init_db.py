import sqlite3, hashlib, random, bcrypt
from datetime import datetime, timedelta


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
    return random_time.strftime("%Y-%m-%d %H:%M:%S")


def initialize_patients(cursor):
    patient_commands = [
        (
            "sad_patient",
            bcrypt.hashpw("sad".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "happy_patient",
            bcrypt.hashpw("happy".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "stressed_patient",
            bcrypt.hashpw("stressed".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
        (
            "sleepy_patient",
            bcrypt.hashpw("sleepy".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            0,
        ),
    ]
    cursor.executemany(
        "INSERT INTO Users (username, user_password, last_login, dob, user_type) VALUES (?, ?, ?, ?, ?);",
        patient_commands,
    )


def initialize_doctors(cursor):
    doctor_commands = [
        (
            "sad_doctor",
            bcrypt.hashpw("sad".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "happy_doctor",
            bcrypt.hashpw("happy".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "stressed_doctor",
            bcrypt.hashpw("stressed".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
        (
            "sleepy_doctor",
            bcrypt.hashpw("sleepy".encode(), bcrypt.gensalt()).decode(),
            random_timestamp(mode="init_user"),
            random_timestamp(mode="dob"),
            1,
        ),
    ]
    cursor.executemany(
        "INSERT INTO Users (username, user_password, last_login, dob, user_type) VALUES (?, ?, ?, ?, ?);",
        doctor_commands,
    )


def initialize_temperatures(cursor):
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
                hashlib.sha256(f"{random_timestamp}|{random_temperature}|{random_patient}".encode()).hexdigest()
            )
        )

    cursor.executemany(
        "INSERT INTO Temperatures (patient_id, device_id, temp_data, time_logged, hash_value) VALUES (?, ?, ?, ?, ?);",
        data,
    )


def init_db():
    """Initialize the database with schema."""
    with sqlite3.connect("flask_database.db") as connection:
        with open("schema.sql") as f:
            connection.executescript(f.read())

        cursor = connection.cursor()
        initialize_patients(cursor)
        initialize_doctors(cursor)
        initialize_temperatures(cursor)
        connection.commit()


if __name__ == "__main__":
    init_db()
