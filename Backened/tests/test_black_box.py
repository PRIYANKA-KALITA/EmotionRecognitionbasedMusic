# import sys
# import os

# # Add the project root to the Python path so that app can be imported
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import pytest

# import json
# from app import app

# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     with app.test_client() as client:
#         yield client

# def test_test_endpoint(client):
#     response = client.get('/test')
#     assert response.status_code == 200
#     data = response.get_json()
#     assert data.get("message") == "Test endpoint is working!"
#     assert data.get("status") == "success"



# def test_emotion_no_image(client):
#     # Test /api/emotion with no image data
#     response = client.post('/api/emotion', json={})
#     assert response.status_code == 400
#     data = response.get_json()
#     assert "error" in data


# def test_recommendations_default_emotion(client):
#     # Test /api/recommendations without providing an emotion
#     response = client.get('/api/recommendations')
#     assert response.status_code == 200
#     data = response.get_json()
#     # Assuming the service returns a "tracks" key even if recommendations are empty
#     assert "tracks" in data

# # Additional black-box tests can be added for other endpoints (e.g., likes, dislikes, subscription endpoints)



import sys
import os

# Add the project root to the Python path so that app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
import json
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client



def test_test_endpoint(client):
    # Test the /test endpoint
    response = client.get('/test')
    assert response.status_code == 200
    data = response.get_json()
    assert data.get("message") == "Test endpoint is working!"
    assert data.get("status") == "success"



def test_subscription_status(client):
    # Test /api/subscription-status with a valid user ID
    response = client.get('/api/subscription-status/1')
    assert response.status_code in [200, 404]  # User may or may not exist
    data = response.get_json()
    if response.status_code == 200:
        assert "subscribed" in data
        assert "plan" in data
        assert "is_premium" in data
    else:
        assert "error" in data


def test_recommendations(client):
    # Test /api/recommendations with a valid emotion
    response = client.get('/api/recommendations?emotion=happy')
    assert response.status_code == 200
    data = response.get_json()
    assert "tracks" in data
    assert isinstance(data["tracks"], list)


def test_toggle_like(client):
    # Test /api/likes with valid data
    payload = {
        "user_id": 1,
        "track_name": "Test Track",
        "artist": "Test Artist",
        "spotify_url": "http://example.com"
    }
    response = client.post('/api/likes', json=payload)
    assert response.status_code in [200, 400]  # User may or may not exist
    data = response.get_json()
    if response.status_code == 200:
        assert "message" in data
        assert data["message"] in ["Track liked successfully", "Track unliked successfully"]
    else:
        assert "error" in data


def test_toggle_dislike(client):
    # Test /api/dislikes with valid data
    payload = {
        "user_id": 1,
        "track_name": "Test Track",
        "artist": "Test Artist",
        "spotify_url": "http://example.com"
    }
    response = client.post('/api/dislikes', json=payload)
    assert response.status_code in [200, 400]  # User may or may not exist
    data = response.get_json()
    if response.status_code == 200:
        assert "message" in data
        assert data["message"] in ["Track disliked successfully", "Track undisliked successfully"]
    else:
        assert "error" in data

        