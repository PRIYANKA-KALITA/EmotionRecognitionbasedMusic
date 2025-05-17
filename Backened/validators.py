# validators.py

def validate_emotion_request(data):
    """
    Validates that the request data for the /api/emotion endpoint contains an 'image' field.
    Returns a tuple (is_valid: bool, error_message: str).
    """
    if not data:
        return False, "Request data is missing."
    if 'image' not in data:
        return False, "The 'image' field is required."
    # Optionally, add more checks for proper base64 encoding or image format here.
    return True, ""

def validate_user_preferences(data):
    """
    Validates that the request data for the /api/users/preferences endpoint contains required fields.
    For example, it must contain 'user_id' and optionally a valid 'favoriteGenre'.
    """
    if not data:
        return False, "Request data is missing."
    if "user_id" not in data:
        return False, "User ID is required."
    
    # Example: Validate favoriteGenre if provided.
    allowed_genres = {"pop", "rock", "jazz", "classical", "hiphop", "electronic"}
    if "favoriteGenre" in data and data["favoriteGenre"] not in allowed_genres:
        return False, f"Favorite genre must be one of: {', '.join(allowed_genres)}."
    
    # You can add more validation rules for other fields as needed.
    return True, ""
