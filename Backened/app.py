

# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import cv2
import time
import base64
import numpy as np
from deepface import DeepFace
from spotify_service import get_recommendations_by_emotion
from models import db, User, EmotionHistory, FavoriteTrack, Playlist, PlaylistTrack, Rating, Like, Dislike, Save
from flask_migrate import Migrate
# from razorpay_service import create_checkout_session
# from stripe_service import create_checkout_session  # 🆕 Imported Stripe service
from dotenv import load_dotenv  # 🆕 Import dotenv to load environment variables
import stripe  # Import the Stripe module

import os
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
# import razorpay

# Load environment variables from .env file
load_dotenv()



# Create Flask application
app = Flask(__name__)

# # Razorpay client setup
# razorpay_client = razorpay.Client(
#     auth=(os.environ.get("RAZORPAY_KEY_ID"), os.environ.get("RAZORPAY_KEY_SECRET"))
# )



# Enable CORS for all routes with credentials support
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Set Stripe API keys
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY  




# --- Configure Database Connection ---
# Modified: Using PostgreSQL with pg8000 driver on port 5433 and database "music_app"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+pg8000://postgres:password@localhost:5433/music_app'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TESTING'] = True
# Initialize SQLAlchemy and Flask-Migrate
db.init_app(app)
migrate = Migrate(app, db)

# Set debug mode from environment variable (default is False)
debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"





# --- Test PostgreSQL connection ---
try:
    # This uses pg8000 to check the connection manually.
    import pg8000
    conn = pg8000.connect(
        database="music_app",
        user="postgres",
        password="password",
        host="localhost",
        port=5433
    )
    print("Database connected successfully!")
    conn.close()
except Exception as e:
    print("Database connection failed:", e)




#  ****************Stripe pay endpoint****************




    

@app.route('/api/create-checkout-session-stripe', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def create_checkout_session():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        # Get the request data (dummy data will be sent from the frontend)
        data = request.get_json()
        email = data.get("email", "unknown@example.com")  # Default to "unknown@example.com" if not provided
        clerk_id = data.get("clerk_id", "unknown_clerk_id")  # Default to "unknown_clerk_id" if not provided

        # Log the dummy data for debugging purposes
        print(f"Received email: {email}, Clerk ID: {clerk_id}")

        # Create a Stripe Checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Premium Subscription',
                    },
                    'unit_amount': 500,  # Amount in cents ($5.00)
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/',  # Redirect to home page after successful payment
            cancel_url='http://localhost:5173/',   # Redirect to home page if payment is canceled
        )
        return jsonify({"session_id": session.id}), 200
    except Exception as e:
        print(f"Error creating Stripe Checkout session: {e}")  # Log the error
        return jsonify({"error": str(e)}), 403












@app.route('/api/update-subscription', methods=['POST'])
@cross_origin()
def update_subscription():
    """
    Updates the user's subscription status after payment.
    """
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        plan = data.get("plan")
        amount = data.get("amount")

        # Validate required fields
        if not user_id or not plan or not amount:
            return jsonify({"error": "Missing required fields"}), 400

        # Cast user_id to integer
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"error": "Invalid user_id format"}), 400

        # Fetch the user from the database
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Handle None balance
        user_balance = user.balance if user.balance is not None else 0.0

        # Check if the user has sufficient balance
        if user_balance < amount:
            return jsonify({"error": "Insufficient balance"}), 400

        # Deduct the subscription amount from the user's balance
        user.balance = user_balance - amount

        # Set subscription details
        subscription_start_date = datetime.utcnow()
        if plan == "1 month":
            subscription_end_date = subscription_start_date + timedelta(days=30)
        elif plan == "1 year":
            subscription_end_date = subscription_start_date + timedelta(days=365)
        else:
            return jsonify({"error": "Invalid subscription plan"}), 400

        user.subscription_plan = plan
        user.subscription_start_date = subscription_start_date
        user.subscription_end_date = subscription_end_date
        user.is_premium = True  # Mark the user as premium

        # Commit changes to the database
        db.session.commit()

        return jsonify({
            "message": "Subscription updated successfully",
            "subscription_plan": plan,
            "subscription_start_date": subscription_start_date.strftime("%Y-%m-%d"),
            "subscription_end_date": subscription_end_date.strftime("%Y-%m-%d"),
            "remaining_balance": user.balance
        }), 200
    except Exception as e:
        db.session.rollback()
        print("Error in /api/update-subscription:", e)  # Debugging
        return jsonify({"error": str(e)}), 500




@app.route('/api/subscription-status/<user_id>', methods=['GET'])
@cross_origin()
def check_subscription_status(user_id):
    """
    Check if the user has an active subscription.
    """
    try:
        # Cast user_id to integer
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"error": "Invalid user_id format"}), 400

        # Fetch the user from the database
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if the subscription is active
        today = datetime.utcnow()
        subscription_end_date = user.subscription_end_date

        # Handle None subscription_end_date
        if subscription_end_date and subscription_end_date > today:
            return jsonify({
                "subscribed": True,
                "plan": user.subscription_plan or "Unknown",
                "is_premium": user.is_premium
            }), 200
        else:
            return jsonify({
                "subscribed": False,
                "plan": user.subscription_plan or "Free",
                "is_premium": user.is_premium
            }), 200
    except Exception as e:
        print("Error in /api/subscription-status:", e)
        return jsonify({"error": str(e)}), 500
    


@app.route('/api/emotion', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_emotion():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()
        # Validate that image data is provided
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        image_data = data['image']
        # If the image data starts with data:image, split off the header
        _, encoded = image_data.split(',', 1) if image_data.startswith('data:image') else (None, image_data)
        decoded = base64.b64decode(encoded)
        np_arr = np.frombuffer(decoded, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400

        # Use DeepFace to analyze the image for emotion
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        # If result is a list, use the first element; otherwise, use the dict directly
        dominant_emotion = result[0].get('dominant_emotion', 'Unknown') if isinstance(result, list) else result.get('dominant_emotion', 'Unknown')
        
        return jsonify({'emotion': dominant_emotion})
    except Exception as e:
        # Return error details for debugging
        return jsonify({'error': str(e)}), 500




@app.route('/api/recommendations', methods=['GET'])
@cross_origin()
def recommendations():
    # Retrieve the emotion from query parameters
    emotion = request.args.get("emotion", "neutral")
    try:
        recs = get_recommendations_by_emotion(emotion)
        return jsonify({"tracks": recs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/likes', methods=['POST', 'OPTIONS'])
@cross_origin()
def toggle_like():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    print("Incoming Data:", data)  # Debugging: Log the incoming request data

    if not data or not data.get("user_id") or not data.get("track_name"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Convert user_id to integer
        user_id = int(data.get("user_id"))  # Ensure user_id is an integer
        track_name = data.get("track_name")

        # Step 1: Check if the track is already liked
        existing_like = Like.query.filter_by(user_id=user_id, track_name=track_name).first()
        if existing_like:
            # Remove the like
            db.session.delete(existing_like)
            db.session.commit()
            print("Like removed from database.")  # Debugging: Confirm deletion
            return jsonify({"message": "Track unliked successfully"}), 200

        # Step 2: Check if the track is disliked and remove it
        existing_dislike = Dislike.query.filter_by(user_id=user_id, track_name=track_name).first()
        if existing_dislike:
            db.session.delete(existing_dislike)
            db.session.commit()
            print("Dislike removed from database because track was liked.")  # Debugging: Confirm dislike removal

        # Step 3: Add the like
        like = Like(
            track_name=track_name,
            artist=data.get("artist", ""),
            spotify_url=data.get("spotify_url", ""),
            user_id=user_id
        )
        db.session.add(like)
        db.session.commit()
        print("Like added to database.")  # Debugging: Confirm addition
        return jsonify({"message": "Track liked successfully"}), 200

    except ValueError:
        print("Invalid user_id format.")  # Debugging: Log invalid user_id
        return jsonify({"error": "Invalid user_id format"}), 400

    except Exception as e:
        db.session.rollback()
        print("Error in /api/likes:", e)  # Debugging: Log the error
        return jsonify({"error": str(e)}), 500





@app.route('/api/dislikes', methods=['POST', 'OPTIONS'])
@cross_origin()
def toggle_dislike():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    print("Incoming Data:", data)  # Debugging: Log the incoming request data

    if not data or not data.get("user_id") or not data.get("track_name"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Convert user_id to integer
        user_id = int(data.get("user_id"))  # Ensure user_id is an integer
        track_name = data.get("track_name")

        # Step 1: Check if the track is already disliked
        existing_dislike = Dislike.query.filter_by(user_id=user_id, track_name=track_name).first()
        if existing_dislike:
            # Remove the dislike
            db.session.delete(existing_dislike)
            db.session.commit()
            print("Dislike removed from database.")  # Debugging: Confirm dislike removal
            return jsonify({"message": "Track undisliked successfully"}), 200

        # Step 2: Check if the track is liked and remove it
        existing_like = Like.query.filter_by(user_id=user_id, track_name=track_name).first()
        if existing_like:
            db.session.delete(existing_like)
            db.session.commit()
            print("Like removed from database because track was disliked.")  # Debugging: Confirm like removal

        # Add the dislike
        dislike = Dislike(
            track_name=track_name,
            artist=data.get("artist", ""),
            spotify_url=data.get("spotify_url", ""),
            user_id=user_id
        )
        db.session.add(dislike)
        db.session.commit()
        print("Dislike added to database.")  # Debugging: Confirm dislike addition
        return jsonify({"message": "Track disliked successfully"}), 200

    except ValueError:
        print("Invalid user_id format.")  # Debugging: Log invalid user_id
        return jsonify({"error": "Invalid user_id format"}), 400

    except Exception as e:
        db.session.rollback()
        print("Error in /api/dislikes:", e)  # Debugging: Log the error
        return jsonify({"error": str(e)}), 500





@app.route('/api/track-state', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def get_track_states():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify({}), 200

    data = request.get_json()
    print("Incoming Data for Track States:", data)  # Debugging: Log the incoming request data

    if not data or not data.get("user_id") or not data.get("track_names"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        user_id = int(data.get("user_id"))
        track_names = data.get("track_names")  # Expecting a list of track names

        # Query the database for liked and disliked states for all tracks
        liked_tracks = Like.query.filter(Like.user_id == user_id, Like.track_name.in_(track_names)).all()
        disliked_tracks = Dislike.query.filter(Dislike.user_id == user_id, Dislike.track_name.in_(track_names)).all()

        # Create a dictionary to store the states
        track_states = {}
        for track_name in track_names:
            track_states[track_name] = {
                "liked": any(like.track_name == track_name for like in liked_tracks),
                "disliked": any(dislike.track_name == track_name for dislike in disliked_tracks),
            }

        return jsonify(track_states), 200

    except ValueError:
        print("Invalid user_id format.")  # Debugging: Log invalid user_id
        return jsonify({"error": "Invalid user_id format"}), 400

    except Exception as e:
        print("Error in /api/track-state:", e)  # Debugging: Log unexpected errors
        return jsonify({"error": str(e)}), 500
    

    
@app.route('/api/saves', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_save():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    # Validate required fields for save
    if not data or not data.get("user_id") or not data.get("track_name"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        save = Save(
            track_name=data.get("track_name"),
            artist=data.get("artist", ""),
            spotify_url=data.get("spotify_url", ""),
            user_id=data.get("user_id")
        )
        db.session.add(save)
        db.session.commit()
        return jsonify({"message": "Track saved successfully"}), 200
    except Exception as e:
        print("Error in /api/saves:", e)
        return jsonify({"error": str(e)}), 500



# @app.route('/api/create-checkout-session', methods=['POST'])
# @cross_origin()
# def create_checkout_session_endpoint():
#     data = request.get_json()
#     try:
#         # Get amount from request data; default to 999 paise if not provided.
#         amount = int(data.get("amount", 999))
#     except Exception as e:
#         return jsonify({"error": "Invalid amount"}), 400
#     try:
#         order = create_checkout_session(amount)
#         return jsonify(order), 200  # Return order details (order id, amount, etc.)
#     except Exception as e:
#         print("Error creating checkout session:", e)
#         return jsonify({"error": str(e)}), 500



@app.route('/api/create_test_user', methods=['POST'])
@cross_origin()
def create_test_user():
    try:
        # Get data from the request payload
        data = request.get_json()
        clerk_id = data.get("clerk_id")
        full_name = data.get("full_name")
        email = data.get("email")
        favoriteGenre = data.get("favoriteGenre", "pop")  # Default to "pop" if not provided

        print("Processing email:", email)  # Debugging: Log the email

        # Check if the user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "User already exists", "user_id": existing_user.id}), 200

        # Create a new user with dynamic values
        user = User(
            clerk_id=clerk_id,
            full_name=full_name,
            email=email,
            favoriteGenre=favoriteGenre
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user_id": user.id}), 200

    except IntegrityError as e:
        db.session.rollback()
        print("IntegrityError:", str(e))  # Debugging: Log the error
        return jsonify({"error": "A user with this email already exists."}), 400
    except Exception as e:
        db.session.rollback()
        print("Unexpected Error:", str(e))  # Debugging: Log the error
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app using the debug mode based on environment variable.
    app.run(debug=debug_mode, port=5000)










