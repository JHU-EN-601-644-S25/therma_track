from flask import Flask
from db import db


def config_db():
    app = Flask(__name__)

    SERVER_HOST = ""
    PORT_NUM = ""
    USERNAME = ""
    PASSWORD = ""
    DB_NAME = ""

    SERVER_HOST = "free-db2.cnq40qooeq8t.us-east-2.rds.amazonaws.com"
    PORT_NUM = "3306"
    USERNAME = "root"
    PASSWORD = "root200063^"
 
    DB_NAME = "therma_track"
    DB_URL = f"mysql+mysqlconnector://{USERNAME}:{PASSWORD}@{SERVER_HOST}:{PORT_NUM}/{DB_NAME}"
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    return app
