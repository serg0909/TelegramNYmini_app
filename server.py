from flask import Flask, send_from_directory, request, jsonify
import os
from database import mark_webapp_launched

app = Flask(__name__)

@app.route('/')
def serve_index():
    return send_from_directory('webapp', 'index.html')

@app.route('/translations/webapp/<path:path>')
def serve_translations(path):
    return send_from_directory('translations/webapp', path)

@app.route('/api/track-launch', methods=['POST'])
def track_launch():
    data = request.get_json()
    if data and 'user_id' in data:
        mark_webapp_launched(data['user_id'])
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

@app.route('/<path:path>')
def serve_files(path):
    return send_from_directory('webapp', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
