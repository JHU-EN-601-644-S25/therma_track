from flask_cors import CORS
from config_db import config_db
from db import db
from routes import setup_routes

app = config_db()

# Enable CORS with similar options
cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

setup_routes(app)
# Start the server on port 4000
if __name__ == "__main__":
    # app.register_blueprint(routes.router)
    app.run(host="0.0.0.0", port=4000, debug=True)