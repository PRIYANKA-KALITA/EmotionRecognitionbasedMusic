# import sys
# import os

# # Add the project root to the Python path so that app can be imported
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import pytest
# import json
# from datetime import timedelta
# from app import app, db, User



# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     # Use an in-memory SQLite database for testing
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
#     with app.app_context():
#         db.create_all()
#         yield app.test_client()
#         db.session.remove()
#         db.drop_all()




# def test_update_subscription_missing_fields(client):
#     # Test /api/update-subscription with missing required fields
#     response = client.post('/api/update-subscription', json={})
#     assert response.status_code == 400
#     data = response.get_json()
#     assert "error" in data




# def test_create_test_user(client):
#     # Create a test user first
#     payload = {
#         "clerk_id": "123",
#         "full_name": "Test User",
#         "email": "test@example.com",
#         # "favoriteGenre": "pop"
#     }

#     response = client.post('/api/create_test_user', json=payload)
#     assert response.status_code == 200
#     data = response.get_json()
#     user_id = data.get("user_id")
#     assert user_id is not None




import sys
import os

# Add the project root to the Python path so that app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
import json
from datetime import datetime, timedelta
from app import app, db, User


@pytest.fixture
def client():
    app.config['TESTING'] = True
    # Use an in-memory SQLite database for testing
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()



def test_update_subscription_missing_fields(client):
    # Test /api/update-subscription with missing required fields
    response = client.post('/api/update-subscription', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Missing required fields"



def test_update_subscription_invalid_user_id(client):
    # Test /api/update-subscription with invalid user_id format
    payload = {
        "user_id": "invalid_id",
        "plan": "1 month",
        "amount": 500
    }
    response = client.post('/api/update-subscription', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Invalid user_id format"



def test_update_subscription_insufficient_balance(client):
    # Create a test user with insufficient balance and store the ID within the app context
    with app.app_context():
        user = User(
            clerk_id="13",
            full_name="Test User",
            email="test@example.com",
            balance=100  # Insufficient balance
        )
        db.session.add(user)
        db.session.commit()
        user_id = user.id  # Capture the ID here

        # # Check if the user exists in the database
        # user = User.query.filter_by(email="test@example.com").first()
        # print(user)  # Print the user for debugging

    payload = {
        "user_id": user_id,
        "plan": "1 month",
        "amount": 500  # Amount greater than balance
    }
    response = client.post('/api/update-subscription', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Insufficient balance"


def test_update_subscription_success(client):
    # Create a test user with sufficient balance and store the ID within the app context
    with app.app_context():
        user = User(
            clerk_id="125",
            full_name="Test User",
            email="test@example.com",
            balance=1000  # Sufficient balance
        )
        db.session.add(user)
        db.session.commit()
        user_id = user.id  # Capture the ID here

        # # Check if the user exists in the database
        # user = User.query.filter_by(email="test@example.com").first()
        # print(user)  # Print the user for debugging

    payload = {
        "user_id": user_id,
        "plan": "1 month",
        "amount": 500
    }
    response = client.post('/api/update-subscription', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Subscription updated successfully"
    assert data["remaining_balance"] == 500



def test_create_test_user(client):
    # Check if the user already exists
    with app.app_context():
        existing_user = User.query.filter_by(email="test@example.com").first()
        if not existing_user:
            # Create a test user if it doesn't already exist
            user = User(
                clerk_id="123",
                full_name="Test User",
                email="test@example.com",
                favoriteGenre="pop",
                balance=10000
            )
            db.session.add(user)
            db.session.commit()

       

    # Test the endpoint
    payload = {
        "clerk_id": "123",
        "full_name": "Test User",
        "email": "test@example.com",
        "favoriteGenre": "pop"
    }
    response = client.post('/api/create_test_user', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    user_id = data.get("user_id")
    assert user_id is not None
    assert data["message"] in ["User created successfully", "User already exists"]


