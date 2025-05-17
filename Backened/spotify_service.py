

import os
import time
import requests
from dotenv import load_dotenv
from typing import Dict, List

# Load environment variables from .env file
load_dotenv()

# Store token in memory
token_cache = {"token": None, "expires_at": 0}

CLIENT_ID = os.getenv("CLIENT_ID", "your_spotify_client_id")
CLIENT_SECRET = os.getenv("CLIENT_SECRET", "your_spotify_client_secret")


def get_spotify_token():
    """Retrieve or refresh Spotify access token using in-memory caching."""
    global token_cache

    # Check if token is valid
    if token_cache["token"] and time.time() < token_cache["expires_at"]:
        print("Using cached token.")
        return token_cache["token"]

    try:
        # Request a new token from Spotify API
        auth_url = "https://accounts.spotify.com/api/token"
        response = requests.post(auth_url, data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        })

        # Raise an error if the request fails
        response.raise_for_status()

        # Parse the response
        token_data = response.json()
        token_cache["token"] = token_data["access_token"]
        token_cache["expires_at"] = time.time() + token_data["expires_in"] - 60  # Subtract 60 seconds buffer

        print("New token fetched and stored in memory.")
        return token_cache["token"]

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Spotify token: {e}")
        raise


def get_emotion_mapping(emotion: str) -> Dict:
    """Map emotions to Spotify audio features and Hindi seed genres."""
    emotion = emotion.lower()
    mappings = {
        "happy": {"target_valence": 0.8, "target_energy": 0.7, "target_danceability": 0.7,
                  "seed_genres": ["hindi-pop", "bollywood"], "limit": 10},
        "sad": {"target_valence": 0.2, "target_energy": 0.3, "target_danceability": 0.3,
                "seed_genres": ["hindi-sad", "bollywood"], "limit": 10},
        "angry": {"target_valence": 0.3, "target_energy": 0.9, "target_danceability": 0.5,
                  "seed_genres": ["hindi-rock", "punjabi-rock"], "limit": 8},
        "fear": {"target_valence": 0.3, "target_energy": 0.6, "target_danceability": 0.4,
                 "seed_genres": ["hindi-ambient", "filmi"], "limit": 6},
        "surprise": {"target_valence": 0.7, "target_energy": 0.8, "target_danceability": 0.6,
                     "seed_genres": ["hindi-dance", "bollywood"], "limit": 8},
        "neutral": {"target_valence": 0.5, "target_energy": 0.5, "target_danceability": 0.5,
                    "seed_genres": ["hindi-chill", "indie-hindi"], "limit": 10}
    }
    return mappings.get(emotion, mappings["neutral"])




def get_recommendations_by_emotion(emotion: str) -> List[Dict]:
    """Get Spotify recommendations based on detected emotion."""
    emotion_params = get_emotion_mapping(emotion)
    token = get_spotify_token()
    headers = {"Authorization": f"Bearer {token}"}


    rec_url = "https://api.spotify.com/v1/recommendations"
    params = {
        "limit": emotion_params["limit"],
        "seed_genres": ",".join(emotion_params["seed_genres"][:2]),
        "target_valence": emotion_params["target_valence"],
        "target_energy": emotion_params["target_energy"],
        "target_danceability": emotion_params["target_danceability"],
        "min_popularity": 30
    }

    try:
        response = requests.get(rec_url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        recommendations = []
        for track in data.get("tracks", []):
            images = track.get("album", {}).get("images", [])
            image_url = images[0].get("url") if images else ""
            preview_url = track.get("preview_url", "")
            artists = [artist.get("name") for artist in track.get("artists", [])]

            recommendations.append({
                "name": track.get("name"),
                "artist": ", ".join(artists),
                "album": track.get("album", {}).get("name", ""),
                "image": image_url,
                "spotify_url": track.get("external_urls", {}).get("spotify", ""),
                "preview_url": preview_url,
                "emotion": emotion
            })

        return recommendations

    except requests.exceptions.HTTPError as e:
        print(f"Spotify API error: {e.response.text}")
        return get_fallback_recommendations(emotion, token, headers)





def get_fallback_recommendations(emotion: str, token: str, headers: Dict) -> List[Dict]:
    """Fallback method using search if recommendations API fails."""
    emotion_keywords = {
        "happy": "Hindi upbeat OR Bollywood joyful",
        "sad": "Hindi sad OR Bollywood emotional",
        "angry": "Hindi intense OR Bollywood rock",
        "fear": "Hindi suspenseful OR Bollywood eerie",
        "surprise": "Hindi energetic OR Bollywood dance",
        "neutral": "Hindi chill OR Bollywood relaxed"
    }
    query = emotion_keywords.get(emotion.lower(), "Hindi chill")

    search_url = "https://api.spotify.com/v1/search"
    params = {"q": query, "type": "track", "limit": 6, "market": "IN"}


    try:
        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        tracks = data.get("tracks", {}).get("items", [])

        return [{
            "name": track.get("name"),
            "artist": ", ".join(artist.get("name") for artist in track.get("artists", [])),
            "album": track.get("album", {}).get("name", ""),
            "image": track.get("album", {}).get("images", [{}])[0].get("url", ""),
            "spotify_url": track.get("external_urls", {}).get("spotify", ""),
            "preview_url": track.get("preview_url", ""),
            "emotion": emotion
        } for track in tracks]

    except Exception as e:
        print(f"Fallback search failed: {str(e)}")
        return []



        




