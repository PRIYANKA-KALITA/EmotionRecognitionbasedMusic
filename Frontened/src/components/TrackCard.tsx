

// import React, { useState, useEffect } from "react"; // ✅ Added useEffect for fetching state on mount
// import { Heart, ThumbsUp, ThumbsDown, Bookmark, Play } from "lucide-react";

// interface Track {
//   name: string;
//   artist: string;
//   album: string;
//   image: string;
//   spotify_url: string;
// }

// interface Props {
//   track: Track;
//   onPlay: (embedUrl: string) => void; // Callback for playback
// }


// const TrackCard: React.FC<Props> = ({ track, onPlay }) => {
//   const [favorite, setFavorite] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [disliked, setDisliked] = useState(false);
//   const [saved, setSaved] = useState(false);

//   // Retrieve user_id from local storage
//   const user_id = localStorage.getItem("user_id");

//   // Helper function to check if user_id exists
//   const ensureUserId = () => {
//     if (!user_id) {
//       alert("Please create a test user first!");
//       return false;
//     }
//     return true;
//   };


//   // ✅ Added: Fetch the current state of the track (liked/disliked) from the backend
//   useEffect(() => {
//     const fetchTrackState = async () => {
//       if (!ensureUserId()) return;
  
//       try {
//         const response = await fetch(`http://localhost:5000/api/track-state`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_id,
//             track_name: track.name,
//           }),
//         });
  
//         if (response.ok) {
//           const result = await response.json();
//           console.log("Track State:", result); // ✅ Debugging: Log the fetched state
//           setLiked(result.liked); // ✅ Update the "liked" state
//           setDisliked(result.disliked); // ✅ Update the "disliked" state
//         } else {
//           console.error("Failed to fetch track state");
//         }
//       } catch (error) {
//         console.error("Error fetching track state", error);
//       }
//     };
  
//     fetchTrackState(); // Call the function when the component mounts
//   }, [track.name]); // Dependency array ensures it runs when the track changes


//   // 1. /api/track-state Endpoint
//   // Purpose: This endpoint is responsible for checking whether a specific track is liked or disliked by a specific user.
//   // How It Works:
//   // The frontend sends a POST request to this endpoint with the user_id and track_name.
//   // The backend queries the likes and dislikes tables in the database to check if the track is liked or disliked by the user.
//   // The backend returns a JSON response with the liked and disliked states.
  




//   // Handler for Favorite button
//   const handleAddFavorite = async () => {
//     if (!ensureUserId()) return;

//     try {
//       const response = await fetch("http://localhost:5000/api/favorites", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id,
//           track_name: track.name,
//           artist: track.artist,
//           spotify_url: track.spotify_url,
//         }),
//       });
//       if (response.ok) {
//         setFavorite(true);
//       } else {
//         console.error("Failed to add favorite");
//       }
//     } catch (error) {
//       console.error("Error adding favorite", error);
//     }
//   };







//   const handleLike = async () => {
//     if (!ensureUserId()) return;
  
//     const payload = {
//       user_id,
//       track_name: track.name,
//       artist: track.artist,
//       spotify_url: track.spotify_url,
//     };
  
//     try {
//       const response = await fetch("http://localhost:5000/api/likes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         const result = await response.json();
//         console.log(result);
  
//         if (result.message === "Track liked successfully") {
//           setLiked(true); // ✅ Modified: Mark the track as liked
//           setDisliked(false); // ✅ Modified: Reset "disliked" state
//         } else if (result.message === "Track unliked successfully") {
//           setLiked(false); // ✅ Modified: Mark the track as unliked
//         }
//       } else {
//         console.error("Failed to toggle like");
//       }
//     } catch (error) {
//       console.error("Error toggling like", error);
//     }
//   };  


 


//   const handleDislike = async () => {
//     if (!ensureUserId()) return;
  
//     const payload = {
//       user_id,
//       track_name: track.name,
//       artist: track.artist,
//       spotify_url: track.spotify_url,
//     };
  
//     console.log("Dislike Button Clicked"); // ✅ Debugging: Log when the dislike button is clicked
//     console.log("Current State - Liked:", liked, "Disliked:", disliked); // ✅ Debugging: Log the current state
  
//     try {
//       const response = await fetch("http://localhost:5000/api/dislikes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         const result = await response.json();
//         console.log("Backend Response:", result); // ✅ Debugging: Log the backend response
  
//         if (result.message === "Track disliked successfully") {
//           setDisliked(true); // ✅ Mark the track as disliked
//           setLiked(false); // ✅ Reset "liked" state
//           console.log("State Updated - Liked:", liked, "Disliked:", true); // ✅ Debugging: Log the updated state
//         } else if (result.message === "Track undisliked successfully") {
//           setDisliked(false); // ✅ Mark the track as undisliked
//           console.log("State Updated - Liked:", liked, "Disliked:", false); // ✅ Debugging: Log the updated state
//         }
//       } else {
//         console.error("Failed to toggle dislike");
//         const errorData = await response.json();
//         console.error("Error Response:", errorData); // ✅ Debugging: Log the error response
//       }
//     } catch (error) {
//       console.error("Error toggling dislike", error); // ✅ Debugging: Log any unexpected errors
//     }
//   };      


//   // Handler for Save button
//   const handleSave = async () => {
//     if (!ensureUserId()) return;

//     try {
//       const response = await fetch("http://localhost:5000/api/saves", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id,
//           track_name: track.name,
//           artist: track.artist,
//           spotify_url: track.spotify_url,
//         }),
//       });
//       if (response.ok) {
//         setSaved(true);
//       } else {
//         console.error("Failed to save track");
//       }
//     } catch (error) {
//       console.error("Error saving track", error);
//     }
//   };





//   // Helper: Construct Spotify embed URL from the track's spotify_url
//   const getSpotifyEmbedUrl = (url: string) => {
//     const parts = url.split("/");
//     const lastPart = parts[parts.length - 1];
//     const trackId = lastPart.split("?")[0];
//     return `https://open.spotify.com/embed/track/${trackId}`;
//   };





//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
//       <img src={track.image} alt={track.album} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h3 className="text-xl font-bold">{track.name}</h3>
//         <p className="text-gray-400">{track.artist}</p>
//         {/* Play Button */}
//         <button
//           onClick={() => onPlay(getSpotifyEmbedUrl(track.spotify_url))}
//           className="mt-2 flex items-center justify-center w-full px-3 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors duration-300"
//         >
//           <Play className="h-5 w-5 mr-2" />
//           <span>Play</span>
//         </button>
//         {/* Action Buttons */}
//         <div className="flex justify-around items-center mt-4">
//           {/* Favorite Button */}
//           <button onClick={handleAddFavorite} disabled={favorite} className="p-2 rounded-full transition-colors duration-300">
//             <Heart className={`h-6 w-6 ${favorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`} />
//           </button>

// {/* Like Button */}
// <button onClick={handleLike} className="p-2 rounded-full transition-colors duration-300">
//   <ThumbsUp className={`h-6 w-6 ${liked ? "text-green-500" : "text-gray-400 hover:text-green-500"}`} />
// </button>

// {/* Dislike Button */}
// <button onClick={handleDislike} className="p-2 rounded-full transition-colors duration-300">
//   <ThumbsDown className={`h-6 w-6 ${disliked ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`} />
// </button>



//           {/* Save Button */}
//           <button onClick={handleSave} disabled={saved} className="p-2 rounded-full transition-colors duration-300">
//             <Bookmark className={`h-6 w-6 ${saved ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackCard;











import React, { useState, useEffect } from "react";
import { Heart, Bookmark, Play } from "lucide-react";
// Using react-icons for thumbs and bookmark icons
import { FaThumbsUp, FaThumbsDown, FaBookmark } from "react-icons/fa";

interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  spotify_url: string;
}

interface Props {
  track: Track;
  onPlay: (embedUrl: string) => void;
}

const TrackCard: React.FC<Props> = ({ track, onPlay }) => {
  const [favorite, setFavorite] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  const user_id = localStorage.getItem("user_id");

  const ensureUserId = () => {
    if (!user_id) {
      alert("Please create a test user first!");
      return false;
    }
    return true;
  };

  // useEffect(() => {
  //   const fetchTrackState = async () => {
  //     if (!ensureUserId()) return;

  //     try {
  //       const response = await fetch(`http://localhost:5000/api/track-state`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ user_id, track_name: track.name }),
  //       });

  //       if (response.ok) {
  //         const result = await response.json();
  //         setLiked(result[track.name].liked);
  //         setDisliked(result[track.name].disliked);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching track state", error);
  //     }
  //   };

  //   fetchTrackState();
  // }, [track.name]);

  const handleAddFavorite = async () => {
    if (!ensureUserId()) return;

    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          track_name: track.name,
          artist: track.artist,
          spotify_url: track.spotify_url,
        }),
      });
      if (response.ok) setFavorite(true);
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  };

  const handleLike = async () => {
      if (!ensureUserId()) return;
    
      const payload = {
        user_id,
        track_name: track.name,
        artist: track.artist,
        spotify_url: track.spotify_url,
      };
    
      try {
        const response = await fetch("http://localhost:5000/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const result = await response.json();
          console.log("Like API result:", result);
          // Use includes() to handle minor variations in the message
          if (result.message && result.message.includes("liked successfully")) {
            setLiked(true);
            setDisliked(false);
          } else if (result.message && result.message.includes("unliked successfully")) {
            setLiked(false);
          }
        } else {
          console.error("Failed to toggle like. Status:", response.status);
        }
      } catch (error) {
        console.error("Error toggling like. Possible network issue:", error);
        alert("Failed to connect to the server. Please try again later.");
      }
    };

    const handleDislike = async () => {
    if (!ensureUserId()) return;

    const payload = {
      user_id,
      track_name: track.name,
      artist: track.artist,
      spotify_url: track.spotify_url,
    };

    try {
      const response = await fetch("http://localhost:5000/api/dislikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message === "Track disliked successfully") {
          setDisliked(true);
          setLiked(false);
        } else if (result.message === "Track undisliked successfully") {
          setDisliked(false);
        }
      }
    } catch (error) {
      console.error("Error toggling dislike", error);
    }
  };

  const handleSave = async () => {
    if (!ensureUserId()) return;

    try {
      const response = await fetch("http://localhost:5000/api/saves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          track_name: track.name,
          artist: track.artist,
          spotify_url: track.spotify_url,
        }),
      });
      if (response.ok) setSaved(true);
    } catch (error) {
      console.error("Error saving track", error);
    }
  };

  const getSpotifyEmbedUrl = (url: string) => {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    const trackId = lastPart.split("?")[0];
    return `https://open.spotify.com/embed/track/${trackId}`;
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
      data-testid="track-card" // <-- Added for Cypress detection
    >
      <img src={track.image} alt={track.album} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{track.name}</h3>
        <p className="text-gray-400">{track.artist}</p>
        <button
          onClick={() => onPlay(getSpotifyEmbedUrl(track.spotify_url))}
          className="mt-2 flex items-center justify-center w-full px-3 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors duration-300"
        >
          <Play className="h-5 w-5 mr-2" />
          <span>Play</span>
        </button>
        <div className="flex justify-around items-center mt-4">
          <button
            data-testid="favorite-button"
            onClick={handleAddFavorite}
            disabled={favorite}
            className="p-2 rounded-full transition-colors duration-300"
          >
            <Heart className={`h-6 w-6 ${favorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`} />
          </button>
          <button
            data-testid="like-button"
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors duration-300 ${liked ? "liked" : ""}`}
          >
            <FaThumbsUp className={liked ? "text-green-500" : "text-gray-400 hover:text-green-500"} />
          </button>
          <button
            data-testid="dislike-button"
            onClick={handleDislike}
            className={`p-2 rounded-full transition-colors duration-300 ${disliked ? "disliked" : ""}`}
          >
            <FaThumbsDown className={disliked ? "text-red-500" : "text-gray-400 hover:text-red-500"} />
          </button>
          <button
            data-testid="save-button"
            onClick={handleSave}
            disabled={saved}
            className={`p-2 rounded-full transition-colors duration-300 ${saved ? "saved" : ""}`}
          >
            <FaBookmark className={saved ? "text-blue-500" : "text-gray-400 hover:text-blue-500"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
