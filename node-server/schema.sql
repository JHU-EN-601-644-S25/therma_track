CREATE TABLE IF NOT EXISTS Patients (
    username TEXT UNIQUE NOT NULL,
    patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_password TEXT NOT NULL,
    last_login TIMESTAMP NOT NULL
);

-- assumes doctor has the same username "doctor"
CREATE TABLE IF NOT EXISTS Doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_password TEXT UNIQUE NOT NULL,
    last_login TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS DoctorPatients (
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    PRIMARY KEY (doctor_id, patient_id)
);

CREATE TABLE IF NOT EXISTS Temperature (
    patient_id INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temp_data FLOAT NOT NULL
);


