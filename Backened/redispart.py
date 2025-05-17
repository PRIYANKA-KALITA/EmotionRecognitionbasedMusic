import os
import redis
import requests
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Configure Redis client
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")  # Use environment variable for Redis host
redis_client = redis.Redis(host=REDIS_HOST, port=6379, db=0)

CLIENT_ID = os.getenv("CLIENT_ID", "dea716ed40cc40b79f656f9fcbec3a02")
CLIENT_SECRET = os.getenv("CLIENT_SECRET", "c877d293b0f04c4fa2dabe10a96173b1")
print(f"CLIENT_ID: {CLIENT_ID}, CLIENT_SECRET: {CLIENT_SECRET}")


def get_spotify_token():
    """Retrieve or refresh Spotify access token with Redis caching."""
    try:
        # Check if token exists in Redis
        token = redis_client.get("spotify_token")
        print(f"Token from Redis: {token}")
        print(f"CLIENT_ID: {CLIENT_ID}, CLIENT_SECRET: {CLIENT_SECRET}")
        if token:
            print("Token retrieved from Redis.")
            return token.decode("utf-8")
        
        # Request a new token from Spotify API
        auth_url = "https://accounts.spotify.com/api/token"
        response = requests.post(auth_url, data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        })
        
        # Raise an error if the request fails
        response.raise_for_status()
        
        # Parse the response and cache the token
        token_data = response.json()
        token = token_data.get("access_token")
        expires_in = token_data.get("expires_in", 3600)
        
        # Cache the token in Redis with a slight buffer
        redis_client.setex("spotify_token", expires_in - 60, token)
        print(f"Token stored in Redis: {token}")
        return token

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Spotify token: {e}")
        if e.response:
            print(f"Response Status Code: {e.response.status_code}")
            print(f"Response Body: {e.response.text}")
        raise
    except Exception as e:
        print(f"Unexpected error in get_spotify_token: {str(e)}")
        raise



def get_emotion_mapping(emotion: str) -> Dict:
    """
    Map emotions to Spotify audio features and Hindi seed genres.
    This mapping uses Hindi-specific genres/keywords so that the recommendations
    will be more suited for Hindi music.
    """
    emotion = emotion.lower()
    mappings = {
        "happy": {
            "target_valence": 0.8,  # High positivity
            "target_energy": 0.7,   # Energetic
            "target_danceability": 0.7,
            "seed_genres": ["hindi-pop", "bollywood"],
            "limit": 10
        },
        "sad": {
            "target_valence": 0.2,  # Low positivity
            "target_energy": 0.3,   # Calm
            "target_danceability": 0.3,
            "seed_genres": ["hindi-sad", "bollywood"],
            "limit": 10
        },
        "angry": {
            "target_valence": 0.3,
            "target_energy": 0.9,   # Very energetic
            "target_danceability": 0.5,
            "seed_genres": ["hindi-rock", "punjabi-rock"],
            "limit": 8
        },
        "fear": {
            "target_valence": 0.3,
            "target_energy": 0.6,   # Moderate energy
            "target_danceability": 0.4,
            "seed_genres": ["hindi-ambient", "filmi"],
            "limit": 6
        },
        "surprise": {
            "target_valence": 0.7,
            "target_energy": 0.8,   # High energy
            "target_danceability": 0.6,
            "seed_genres": ["hindi-dance", "bollywood"],
            "limit": 8
        },
        "neutral": {
            "target_valence": 0.5,  # Neutral
            "target_energy": 0.5,   # Moderate
            "target_danceability": 0.5,
            "seed_genres": ["hindi-chill", "indie-hindi"],
            "limit": 10
        }
    }


    return mappings.get(emotion, mappings["neutral"])





def get_recommendations_by_emotion(emotion: str) -> List[Dict]:
    """
    Get Spotify recommendations based on the detected emotion using audio features.
    Returns a list of track information with metadata.
    """
    emotion_params = get_emotion_mapping(emotion)
    token = get_spotify_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Use Spotify's recommendation API with the Hindi seed genres
    rec_url = "https://api.spotify.com/v1/recommendations"
    params = {
        "limit": emotion_params["limit"],
        "seed_genres": ",".join(emotion_params["seed_genres"][:2]),  # Use first 2 genres
        "target_valence": emotion_params["target_valence"],
        "target_energy": emotion_params["target_energy"],
        "target_danceability": emotion_params["target_danceability"],
        "min_popularity": 30  # Filter out very obscure tracks
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
                "emotion": emotion  # Include detected emotion for reference
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
    params = {
        "q": query,
        "type": "track",
        "limit": 6,
        "market": "IN"
    }
    


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




