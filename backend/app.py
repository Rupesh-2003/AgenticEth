from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# File to store wallet details
WALLET_FILE = "wallet_details.txt"
google_api_key = os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = google_api_key

# Initialize Flask app
app = Flask(__name__)
CORS(app)

def save_wallet_details(wallet_data):
    """Save wallet details to a file."""
    with open(WALLET_FILE, "w") as file:
        file.write(wallet_data)

def load_wallet_details():
    """Load wallet details from a file."""
    if os.path.exists(WALLET_FILE):
        with open(WALLET_FILE, "r") as file:
            return file.read()
    return None

def initialize_cdp():
    """Initialize CDP wrapper with existing wallet data if available."""
    wallet_data = load_wallet_details()
    if wallet_data:
        cdp = CdpAgentkitWrapper(cdp_wallet_data=wallet_data)
    else:
        cdp = CdpAgentkitWrapper()
        save_wallet_details(cdp.export_wallet())
    return cdp

# Initialize CDP wrapper and agent
cdp = initialize_cdp()
toolkit = CdpToolkit.from_cdp_agentkit_wrapper(cdp)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)
tools = toolkit.get_tools()
agent_executor = create_react_agent(llm, tools)

@app.route("/chat", methods=["POST"])
def chat():
    """
    Endpoint to handle chat interactions with the CDP agent.
    Expects a JSON payload with a "message" field.
    """
    data = request.json
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400

    user_input = data["message"]

    # Process user input with the agent
    events = agent_executor.stream(
        {"messages": [("user", user_input)]},
        stream_mode="values"
    )

    # Collect responses from the agent
    responses = []
    for event in events:
        response = event["messages"][-1].content
        responses.append(response)

    # Return the last response (or all responses if needed)
    return jsonify({"response": responses[-1]})

@app.route("/ping", methods=["GET"])
def ping():
    """Simple endpoint to check if the server is running."""
    return jsonify({"message": "pong"})

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5001))
    app.run(host="0.0.0.0", port=port, debug=True)