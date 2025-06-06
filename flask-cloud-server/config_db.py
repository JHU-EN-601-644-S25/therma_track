from flask import Flask
from db import db
from dotenv import load_dotenv
import os

load_dotenv()


def config_db():
    app = Flask(__name__)

    server = os.getenv("AWS_SERVER_HOST")
    port = os.getenv("AWS_PORT_NUM")
    username = os.getenv("AWS_USERNAME")
    password = os.getenv("AWS_PASSWORD")
    database = os.getenv("AWS_DATABASE_NAME")

    db_url = f"mysql+mysqlconnector://{username}:{password}@{server}:{port}/{database}"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    return app, db
