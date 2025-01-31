from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

from utils.wallet_connect import wallet_bp
from utils.ai_agent import ai_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(wallet_bp)
app.register_blueprint(ai_bp)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def mini_app():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)