CREATE TABLE IF NOT EXISTS Users (
    username TEXT UNIQUE NOT NULL,
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_password TEXT NOT NULL,
    last_login TIMESTAMP NOT NULL,
    dob TIMESTAMP NOT NULL,
    user_type INTEGER NOT NULL  -- 0 means patient, 1 means doctor
);

CREATE TABLE IF NOT EXISTS DoctorPatients (
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    PRIMARY KEY (doctor_id, patient_id)
);

CREATE TABLE IF NOT EXISTS Temperatures (
    patient_id INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    time_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temp_data FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS AuditLogs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  timestamp TEXT DEFAULT (datetime('now')),
  details TEXT
);

ALTER TABLE Users ADD COLUMN failed_attempts INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN account_locked_until TEXT;

ALTER TABLE Temperatures ADD COLUMN hash_value TEXT;
