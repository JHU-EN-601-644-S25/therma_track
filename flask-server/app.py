from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS with similar options
cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Import and register your Flask routes (similar to `app.use("/", router)`)
import routes  # Assuming your routes are in a separate file named `your_routes.py`

# Start the server on port 4000
if __name__ == "__main__":
    app.register_blueprint(routes.router)
    app.run(host="0.0.0.0", port=4000, debug=True)
