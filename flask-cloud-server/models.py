from config_db import config_db
from datetime import datetime, timedelta, timezone
import random
from db import db


class User(db.Model):
    __tablename__ = "Users"  # Name of the table in the database

    # Columns defined as per your schema
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    user_password = db.Column(db.Text, nullable=False)
    last_login = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    user_type = db.Column(db.Integer, nullable=False)
    dob = db.Column(db.DateTime(timezone=True), nullable=False)
    failed_attempts = db.Column(db.Integer, default=0)
    account_locked_until = db.Column(db.DateTime, nullable=True)
    # user_email = db.Column(db.Text, nullable=False)
    user_secret = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"


class DoctorPatient(db.Model):

    __tablename__ = "DoctorPatients"
    log_id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, nullable=False)
    patient_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<DoctorPatient {self.doctor_id} {self.patient_id}>"


class TempLog(db.Model):

    __tablename__ = "Temperature"

    log_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, nullable=False)
    device_id = db.Column(db.Integer, nullable=False)
    time_logged = db.Column(db.DateTime(timezone=True), nullable=False)
    temp_data = db.Column(db.Float, nullable=False)
    hash_value = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<TempLog {self.patient_id} {self.device_id}: {self.temp_data}>"

class AuditLog(db.Model):
    
    __tablename__ = "AuditLogs"
    
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=True)
    action = db.Column(db.String(64), nullable=False)
    status = db.Column(db.String(64), nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    details = db.Column(db.Text, default="")
    
    def __repr__(self):
        return f"<AuditLog {self.log_id} {self.user_id}>"
