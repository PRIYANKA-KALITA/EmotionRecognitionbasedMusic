


import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TrackCard from "../components/TrackCard";
import MiniPlayer from "../components/MiniPlayer";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../context/UserContext"; // Example import for user context


// Outside the component
const stripePromise = loadStripe("pk_test_51RBUL5HIcz4N5uQ4lUhpbTqnjRXsh3zwaHTwFHIyD9oEKvspM4JBCgJZ5lX45lkFFmmfIxGz7w3vJaXcGGfxrGF300PxZnBPAu");


interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  spotify_url: string;
}


function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emotion } = location.state || { emotion: "neutral" };
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState("");
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>("");

  const [playCount, setPlayCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const user = useUser(); // Access user data from context
  // const { email: user_email, clerk_id } = user || {}; // Destructure user properties


  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/subscription-status-stripe/${user_id}`);
        const data = await response.json();

        if (response.ok && data.is_premium) {
          setIsPremium(true);
          setPlayCount(Infinity); // Set unlimited plays for premium users
        } else {
          setPlayCount(0); // Reset play count for free users
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  // Fetch recommendations based on emotion
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/recommendations?emotion=${emotion}`);
        const data = await response.json();
        if (response.ok) {
          setTracks(data.tracks);
        } else {
          console.log(data.error);
          setError(data.error || "Error fetching recommendations");
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Error connecting to recommendation server");
      }
    };
    fetchRecommendations();
  }, [emotion]);


  
  // Handle song play
  const handlePlay = (embedUrl: string) => {
    if (playCount !== Infinity && playCount >= 5) {
      setShowUpgrade(true);
      return;
    }
    setCurrentEmbedUrl(embedUrl);
    if (playCount !== Infinity) {
      setPlayCount(playCount + 1);
    }
  };



  // Navigate to subscription page
  const handleUpgradeClose = () => {
    navigate("/subscription");
  };



  const verifyPayment = async () => {
    const clerk_id = localStorage.getItem("clerk_id"); // Retrieve the user's Clerk ID
    const session_id = localStorage.getItem("stripe_session_id"); // Retrieve the session ID
  
    if (!clerk_id || !session_id) return;
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerk_id, session_id }),
      });
  
      const data = await response.json();
      if (response.ok && data.is_premium) {
        setIsPremium(true);
        setPlayCount(Infinity); // Allow infinite plays
      } else {
        setIsPremium(false);
        setPlayCount(0); // Reset play count for free users
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };
  
  // Call verifyPayment on component mount
  useEffect(() => {
    verifyPayment();
  }, []);


  
  const handleStripeUpgrade = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        console.error("User ID not found in localStorage.");
        return;
      }
  
      const response = await fetch("http://127.0.0.1:5000/api/create-checkout-session-stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });
  
      const data = await response.json();
      if (!response.ok || !data.session_id) {
        throw new Error(data.error || "Failed to create Stripe checkout session.");
      }
  
      localStorage.setItem("stripe_session_id", data.session_id); // 💾 Store for verification
  
      const stripe = await stripePromise;
      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId: data.session_id });
        if (result.error) {
          console.error("Stripe checkout error:", result.error.message);
        }
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundLight text-primary dark:text-primaryDark py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold">Your Recommended Tunes</h1>
        <p className="mt-2 text-xl text-secondary">
          Based on your emotion: <span className="font-bold">{emotion}</span>
        </p>
      </header>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {tracks.length === 0 && !error ? (
        <p data-testid="loading-message" className="text-center text-secondary">
          Loading recommendations...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, index) => (
            <TrackCard
              key={index}
              track={track}
              onPlay={(embedUrl: string) => handlePlay(embedUrl)}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-orange-400 hover:underline">
          ← Back to Home
        </Link>
      </div>

      {currentEmbedUrl && (
        <MiniPlayer embedUrl={currentEmbedUrl} onClose={() => setCurrentEmbedUrl("")} />
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="bg-backgroundLight dark:bg-background p-6 rounded-lg text-center w-80 sm:w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primaryDark dark:text-primary">
              Upgrade to Premium
            </h2>
            <p className="mb-4 text-secondary">
              You have reached the limit of 5 free song plays.
              Upgrade to premium for unlimited access!
            </p>

            {/* Original Button */}
            <button
              onClick={handleUpgradeClose}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded transition-colors duration-300"
            >
              Upgrade to Premium
            </button>

            {/* Stripe Upgrade Button */}
            <button
  onClick={handleStripeUpgrade}
  className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-300"
>
  Upgrade via Stripe
</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RecommendationsPage;











// import React, { useEffect, useState } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import TrackCard from "../components/TrackCard";
// import MiniPlayer from "../components/MiniPlayer";
// import { loadStripe } from "@stripe/stripe-js";
// import { useUser } from "../context/UserContext"; // Example import for user context

// // Outside the component
// const stripePromise = loadStripe("pk_test_51RBUL5HIcz4N5uQ4lUhpbTqnjRXsh3zwaHTwFHIyD9oEKvspM4JBCgJZ5lX45lkFFmmfIxGz7w3vJaXcGGfxrGF300PxZnBPAu");

// interface Track {
//   name: string;
//   artist: string;
//   album: string;
//   image: string;
//   spotify_url: string;
// }

// function RecommendationsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { emotion } = location.state || { emotion: "neutral" };
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [error, setError] = useState("");
//   const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>("");

//   const [playCount, setPlayCount] = useState(0);
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   const [isPremium, setIsPremium] = useState(false);
//   const user = useUser(); // Access user data from context
//   const user_id = localStorage.getItem("user_id"); // Assuming user_id is in localStorage

//   // Fetch subscription status
//   useEffect(() => {
//     const fetchSubscriptionStatus = async () => {
//       if (!user_id) return;

//       try {
//         const response = await fetch(`http://127.0.0.1:5000/api/subscription-status-stripe/${user_id}`);
//         const data = await response.json();

//         if (response.ok && data.is_premium) {
//           setIsPremium(true);
//           setPlayCount(Infinity); // Set unlimited plays for premium users
//         } else {
//           setPlayCount(0); // Reset play count for free users
//         }
//       } catch (error) {
//         console.error("Error fetching subscription status:", error);
//       }
//     };

//     fetchSubscriptionStatus();
//   }, [user_id]);

//   // Fetch recommendations based on emotion
//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const response = await fetch(`http://127.0.0.1:5000/api/recommendations?emotion=${emotion}`);
//         const data = await response.json();
//         if (response.ok) {
//           setTracks(data.tracks);
//         } else {
//           console.log(data.error);
//           setError(data.error || "Error fetching recommendations");
//         }
//       } catch (err) {
//         console.error("Fetch failed:", err);
//         setError("Error connecting to recommendation server");
//       }
//     };
//     fetchRecommendations();
//   }, [emotion]);

//   // Handle song play
//   const handlePlay = (embedUrl: string) => {
//     if (playCount !== Infinity && playCount >= 5) {
//       setShowUpgrade(true);
//       return;
//     }
//     setCurrentEmbedUrl(embedUrl);
//     if (playCount !== Infinity) {
//       setPlayCount(playCount + 1);
//     }
//   };

//   // Navigate to subscription page
//   const handleUpgradeClose = () => {
//     navigate("/subscription");
//   };

//   // Handle Stripe Upgrade
//   const handleStripeUpgrade = async () => {
//     try {
//       // Send dummy data to satisfy backend expectations
//       const response = await fetch("http://127.0.0.1:5000/api/create-checkout-session-stripe", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: "dummy@example.com", // Dummy email
//           clerk_id: "dummy_clerk_id", // Dummy Clerk ID
//         }),
//       });
  
//       const data = await response.json();
//       if (!response.ok || !data.session_id) {
//         throw new Error(data.error || "Failed to create Stripe checkout session.");
//       }
  
//       // Redirect to Stripe Checkout
//       const stripe = await stripePromise;
//       if (stripe) {
//         const result = await stripe.redirectToCheckout({ sessionId: data.session_id });
//         if (result.error) {
//           console.error("Stripe checkout error:", result.error.message);
//         }
//       }
//     } catch (error) {
//       console.error("Error creating Stripe checkout session:", error);
//     }
//   };  
  


//   return (
//     <div className="min-h-screen bg-background dark:bg-backgroundLight text-primary dark:text-primaryDark py-12 px-4">
//       <header className="text-center mb-8">
//         <h1 className="text-5xl font-bold">Your Recommended Tunes</h1>
//         <p className="mt-2 text-xl text-secondary">
//           Based on your emotion: <span className="font-bold">{emotion}</span>
//         </p>
//       </header>
//       {error && <p className="text-red-400 text-center mb-4">{error}</p>}

//       {tracks.length === 0 && !error ? (
//         <p data-testid="loading-message" className="text-center text-secondary">
//           Loading recommendations...
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tracks.map((track, index) => (
//             <TrackCard
//               key={index}
//               track={track}
//               onPlay={(embedUrl: string) => handlePlay(embedUrl)}
//             />
//           ))}
//         </div>
//       )}

//       <div className="mt-8 text-center">
//         <Link to="/" className="text-orange-400 hover:underline">
//           ← Back to Home
//         </Link>
//       </div>

//       {currentEmbedUrl && (
//         <MiniPlayer embedUrl={currentEmbedUrl} onClose={() => setCurrentEmbedUrl("")} />
//       )}

//       {/* Upgrade Modal */}
//       {showUpgrade && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
//         >
//           <div className="bg-backgroundLight dark:bg-background p-6 rounded-lg text-center w-80 sm:w-96 shadow-lg">
//             <h2 className="text-2xl font-bold mb-4 text-primaryDark dark:text-primary">
//               Upgrade to Premium
//             </h2>
//             <p className="mb-4 text-secondary">
//               You have reached the limit of 5 free song plays.
//               Upgrade to premium for unlimited access!
//             </p>

//             <button
//               onClick={handleUpgradeClose}
//               className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded transition-colors duration-300"
//             >
//               Upgrade to Premium
//             </button>

//             <button
//               onClick={handleStripeUpgrade}
//               className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-300"
//             >
//               Upgrade via Stripe
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }

// export default RecommendationsPage;
