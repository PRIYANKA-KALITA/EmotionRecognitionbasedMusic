
// src/pages/Player.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  spotify_url: string;
  // Optionally, you can add audioUrl if you integrate playback here.
}

const Player = () => {
  const { state } = useLocation();
  const searchQuery = state?.searchQuery || "";
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // When a search query is provided, call the backend Spotify recommendations endpoint.
  useEffect(() => {
    if (!searchQuery) return;
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:5000/api/recommendations?emotion=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (response.ok) {
          // Optionally limit to 3 songs.
          setTracks(data.tracks.slice(0, 3));
        } else {
          setError(data.error || "Error fetching recommendations");
        }
      } catch (err) {
        setError("Error connecting to recommendation server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundLight text-primary dark:text-primaryDark py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Player</h1>
        <p className="text-secondary">
          Search Results for: <span className="font-bold">{searchQuery}</span>
        </p>
      </header>
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {/* Display recommended tracks in a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track, index) => (
          <motion.div
            key={index}
            className="p-4 bg-gray-800 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img src={track.image} alt={track.album} className="w-full h-48 object-cover rounded" />
            <div className="mt-4">
              <h3 className="text-xl font-bold">{track.name}</h3>
              <p className="text-gray-400">{track.artist}</p>
              <p className="text-sm">{track.album}</p>
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-indigo-500 hover:underline"
              >
                Listen on Spotify
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="text-orange-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Player;




