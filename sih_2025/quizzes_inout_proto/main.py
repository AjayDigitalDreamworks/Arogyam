# --- Import necessary packages ---
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os

# --- Initial Server Setup ---
app = Flask(__name__)
CORS(app)

# --- MongoDB Connection ---
# !!! IMPORTANT !!!
# Replace the placeholder string below with your actual MongoDB connection URI.
# You can get this from your MongoDB Atlas dashboard. 
MONGO_URI = "mongodb+srv://hellopy1526_db_user_sih_quiz:JhuyWkhz4aUnWek2@cluster0.oac39j1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(MONGO_URI)
    # The database will be created if it doesn't exist
    db = client.get_database('mental_health_db') 
    # The collection will be created if it doesn't exist
    results_collection = db.get_collection('student_results')
    print("Successfully connected to MongoDB.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    client = None

# --- API Route for Serving the HTML Frontend ---
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')


# --- API Route for Saving Results ---
@app.route('/api/save-results', methods=['POST'])
def handle_save_results():
    """Receives JSON data from the frontend and saves it to MongoDB."""
    if not client:
        return jsonify({"message": "Database connection is not available."}), 500

    try:
        data = request.get_json()

        if not data or 'userId' not in data:
            return jsonify({"message": "Invalid or missing data."}), 400

        # Insert the new data into the MongoDB collection
        insert_result = results_collection.insert_one(data)

        print(f"Successfully saved results for user: {data.get('userId')} with DB ID: {insert_result.inserted_id}")
        return jsonify({"message": "Data saved successfully!", "id": str(insert_result.inserted_id)}), 200

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"message": "An internal server error occurred."}), 500


# --- Start the Server ---
if __name__ == '__main__':
    app.run(port=5000, debug=True)

