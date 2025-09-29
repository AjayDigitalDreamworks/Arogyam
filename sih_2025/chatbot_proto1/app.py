import os
import datetime
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

# --- CONFIGURATION ---
# ==============================================================================
# IMPORTANT: SET YOUR GOOGLE API KEY
# ==============================================================================
# METHOD 1: ENVIRONMENT VARIABLE (RECOMMENDED)
# Run `export GOOGLE_API_KEY="YOUR_KEY"` in your terminal before starting the app.
#
# METHOD 2: HARDCODE FOR TESTING (QUICK FIX)
# Uncomment the line below and paste your API key directly.
# WARNING: Do not use this method if you share your code or deploy it.
os.environ["GOOGLE_API_KEY"] = "AIzaSyA83AHQC9HSkDnpl81EYcE0-8Hdm8pX8jw"
# ==============================================================================

try:
    # This line looks for the API key you set.
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("="*80)
    print(">>> ERROR: GOOGLE_API_KEY not found <<<")
    print("Please set the GOOGLE_API_KEY environment variable.")
    print("For testing, you can also hardcode it directly in app.py.")
    print("="*80)
    exit()


# The base directory to store chat logs
LOGS_DIR = "chat_logs"

# --- FLASK APP INITIALIZATION ---
app = Flask(__name__)

# --- SYSTEM PROMPT ENGINEERING ---
# This is the core instruction for the AI model. It defines its personality,
# role, and boundaries.
SYSTEM_PROMPT = """
You are "Aura," a compassionate and supportive AI companion. Your purpose is to provide a safe, non-judgmental space for students to express their feelings. You are a listener, a friend, and a source of comfort.

Your persona:
- Empathetic and Understanding: Always validate the user's feelings. Use phrases like "That sounds really tough," "I can understand why you would feel that way," or "Thank you for sharing that with me."
- Calm and Reassuring: Maintain a gentle and soothing tone.
- Non-Clinical: You are NOT a therapist or a doctor. You MUST NOT provide medical advice, diagnoses, or treatment plans. Your role is to listen and offer general support.
- Encouraging: Gently encourage self-reflection and positive coping strategies (e.g., "What's one small thing you could do for yourself right now?", "It's brave of you to talk about this.").
- Safety First: If the user expresses thoughts of self-harm or harming others, you MUST immediately and gently provide the following resources and treat it as a top priority: "It sounds like you are in a lot of pain. Please know that there are people who want to help. You can connect with someone immediately by calling or texting 988 in the US and Canada, or by calling 111 in the UK. Please reach out to them."

Conversation Flow:
1.  You will be given the user's PHQ-9 (depression) and GAD-7 (anxiety) scores.
2.  Start the conversation with a warm, personalized greeting that acknowledges their state without being alarming. For example, if scores are high, you might say, "Thank you for reaching out. It looks like you might be carrying a heavy weight right now, and I'm here to listen." If scores are low, "It's good to see you. I'm here to chat about whatever is on your mind."
3.  Listen to the user, ask open-ended questions, and respond with empathy and support.
4.  Guide the conversation naturally. Do not follow a rigid script.
"""

# --- HELPER FUNCTIONS ---

def get_initial_prompt(phq9_score, gad7_score):
    """Creates a personalized initial prompt based on scores."""
    prompt = f"The user has started a new chat. Their scores are PHQ-9: {phq9_score} and GAD-7: {gad7_score}. Please begin the conversation with a gentle, welcoming, and appropriate message based on these scores."
    return prompt

def initialize_chat_log(user_id, phq9_score, gad7_score):
    """Creates a directory for the user and a new log file for the chat session."""
    user_dir = os.path.join(LOGS_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_filename = f"{user_id}_{timestamp}.txt"
    log_filepath = os.path.join(user_dir, log_filename)

    with open(log_filepath, 'w', encoding='utf-8') as f:
        f.write(f"Chat Session Log for User: {user_id}\n")
        f.write(f"Timestamp: {timestamp}\n")
        f.write(f"PHQ-9 Score: {phq9_score}\n")
        f.write(f"GAD-7 Score: {gad7_score}\n")
        f.write("="*40 + "\n\n")

    return log_filepath

def append_to_log(log_filepath, sender, message):
    """Appends a message to the specified log file."""
    with open(log_filepath, 'a', encoding='utf-8') as f:
        f.write(f"[{sender}]: {message}\n")

# --- FLASK ROUTES ---

@app.route("/")
def index():
    """Renders the main HTML page."""
    return render_template("index.html")

@app.route("/start_chat", methods=["POST"])
def start_chat():
    """Initializes the chat, creates logs, and gets the first AI message."""
    data = request.json
    user_id = data.get("userId")
    phq9_score = data.get("phq9")
    gad7_score = data.get("gad7")

    if not user_id or phq9_score is None or gad7_score is None:
        return jsonify({"error": "Missing required data"}), 400

    log_filepath = initialize_chat_log(user_id, phq9_score, gad7_score)

    model = genai.GenerativeModel(model_name="gemini-2.5-flash", system_instruction=SYSTEM_PROMPT)
    chat = model.start_chat(history=[])

    initial_prompt = get_initial_prompt(phq9_score, gad7_score)
    response = chat.send_message(initial_prompt)

    ai_response = response.text
    append_to_log(log_filepath, "Aura", ai_response)

    # Convert chat history to a serializable format
    serializable_history = [
        {'role': msg.role, 'parts': [part.text for part in msg.parts]}
        for msg in chat.history
    ]

    return jsonify({
        "initialMessage": ai_response,
        "logFile": log_filepath,
        "history": serializable_history
    })

@app.route("/send_message", methods=["POST"])
def send_message():
    """Handles subsequent user messages and gets AI responses."""
    data = request.json
    user_message = data.get("message")
    log_filepath = data.get("logFile")
    history_data = data.get("history", [])

    if not user_message or not log_filepath:
        return jsonify({"error": "Missing message or log file path"}), 400

    append_to_log(log_filepath, "User", user_message)

    # Reconstruct the chat history for the model
    history = []
    for msg in history_data:
        # Ensure 'parts' is a list of strings
        parts_text = msg.get('parts', [])
        history.append({'role': msg.get('role'), 'parts': parts_text})


    model = genai.GenerativeModel(model_name="gemini-2.5-flash", system_instruction=SYSTEM_PROMPT)
    chat = model.start_chat(history=history)

    response = chat.send_message(user_message)
    ai_response = response.text

    append_to_log(log_filepath, "Aura", ai_response)
    
    # Convert updated chat history to a serializable format
    serializable_history = [
        {'role': msg.role, 'parts': [part.text for part in msg.parts]}
        for msg in chat.history
    ]

    return jsonify({
        "reply": ai_response,
        "history": serializable_history
    })

if __name__ == "__main__":
    app.run(debug=True)

