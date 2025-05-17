# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    clerk_id = db.Column(db.String(128), unique=True, nullable=False)
    full_name = db.Column(db.String(128))
    email = db.Column(db.String(128), unique=True)
    favoriteGenre = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Subscription fields
    subscription_end_date = db.Column(db.DateTime, nullable=True)
    is_premium = db.Column(db.Boolean, default=False)
    balance = db.Column(db.Float, default=10000.0)
    subscription_plan = db.Column(db.String(64), nullable=True)  # New column for subscription plan

    # Relationships
    emotions = db.relationship("EmotionHistory", backref="user", lazy=True)
    favorites = db.relationship("FavoriteTrack", backref="user", lazy=True)
    playlists = db.relationship("Playlist", backref="user", lazy=True)
    ratings = db.relationship("Rating", backref="user", lazy=True)
    likes = db.relationship("Like", backref="user", lazy=True)
    dislikes = db.relationship("Dislike", backref="user", lazy=True)
    saves = db.relationship("Save", backref="user", lazy=True)


class EmotionHistory(db.Model):
    __tablename__ = 'emotion_history'
    id = db.Column(db.Integer, primary_key=True)
    emotion = db.Column(db.String(64), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)


class FavoriteTrack(db.Model):
    __tablename__ = 'favorite_tracks'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    spotify_url = db.Column(db.String(256))
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tracks = db.relationship("PlaylistTrack", backref="playlist", lazy=True)

class PlaylistTrack(db.Model):
    __tablename__ = 'playlist_tracks'
    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), nullable=False)
    track_name = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    spotify_url = db.Column(db.String(256))
    added_at = db.Column(db.DateTime, default=datetime.utcnow)


class Rating(db.Model):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(128), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Like(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    spotify_url = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Dislike(db.Model):
    __tablename__ = 'dislikes'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    spotify_url = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Save(db.Model):
    __tablename__ = 'saves'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    spotify_url = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
