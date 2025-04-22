from flask import Flask
from flask_cors import CORS
<<<<<<< HEAD

app = Flask(__name__)

=======
import ssl

app = Flask(__name__)

TLS = False

>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
# Enable CORS with similar options
cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Import and register your Flask routes (similar to `app.use("/", router)`)
import routes  # Assuming your routes are in a separate file named `your_routes.py`

# Start the server on port 4000
if __name__ == "__main__":
<<<<<<< HEAD
    app.register_blueprint(routes.router)
    app.run(host="0.0.0.0", port=4000, debug=True)
=======

    app.register_blueprint(routes.router)

    if TLS:

        # ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
        # ssl_context.options |= ssl.OP_NO_TLSv1  # Disable TLS 1.0
        # ssl_context.options |= ssl.OP_NO_TLSv1_1

        app.run(
            host="0.0.0.0",
            port=4000,
            debug=True,
            ssl_context=("network/cert.pem", "network/key.pem"),
            # ssl_context=ssl_context,
        )

    else:
        app.run(host="0.0.0.0", port=4000, debug=True)
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
