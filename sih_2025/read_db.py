# find_user.py

from pymongo import MongoClient

def find_user_scores():
    """
    Connects to MongoDB, asks for a userId, finds the corresponding
    user's scores, and prints them.
    """
    client = None # Initialize client to None
    try:
        # --- 1. CONNECT TO DATABASE ---
        # Replace with your connection details
        MONGO_URI = "mongodb+srv://hellopy1526_db_user_sih_quiz:JhuyWkhz4aUnWek2@cluster0.oac39j1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        db_name = "mental_health_db"
        collection_name = "student_results"

        client = MongoClient(MONGO_URI)
        db = client[db_name]
        collection = db[collection_name]
        
        print("✅ Successfully connected to MongoDB!")

        # --- 2. GET USER INPUT ---
        target_user = input("Please enter the userId to search for: ")

        # --- 3. QUERY FOR A SPECIFIC USER ---
        # Use find_one() to get a single document matching the userId
        print(f"\n🔍 Searching for user: {target_user}...")
        document = collection.find_one({'userId': target_user})

        # --- 4. EXTRACT AND PRINT DATA ---
        if document:
            phq9_score = document.get('phq9', {}).get('score', 'N/A')
            gad7_score = document.get('gad7', {}).get('score', 'N/A')

            print("\n--- User Assessment Found ---")
            print(f"User: {target_user}")
            print(f"  PHQ-9 Score: {phq9_score}")
            print(f"  GAD-7 Score: {gad7_score}")
            print("-----------------------------")
        else:
            # Handle case where the user is not found
            print(f"\n❌ User '{target_user}' not found in the database.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # --- 5. CLOSE THE CONNECTION ---
        if client:
            client.close()
            print("\nConnection closed.")

# Run the function
if __name__ == "__main__":
    find_user_scores()