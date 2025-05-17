// import React, { useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../components/Loader"; // Change: Imported Loader component

// function GetRecommendationPage() {
//   const [emotion, setEmotion] = useState("Neutral");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [cameraOn, setCameraOn] = useState(false);
//   const navigate = useNavigate();



  // const startCamera = async () => {
  //   setError("");
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //     }
  //     setCameraOn(true);
  //   } catch (err: any) {
  //     setError("Could not access camera. Please allow permissions in your browser settings.");
  //   }
  // };



//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setCameraOn(false);
//   };

//   const handleDetectEmotion = async () => {
//     setError("");
//     if (!cameraOn || !videoRef.current) {
//       setError("Camera is not started. Please start the camera first.");
//       return;
//     }

//     setLoading(true);
//     // Wait 3 seconds for proper capture
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     try {
//       const canvas = document.createElement("canvas");
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//       }
//       const imageDataUrl = canvas.toDataURL("image/jpeg");

//       const response = await fetch("http://localhost:5000/api/emotion", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ image: imageDataUrl }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setEmotion(data.emotion);
//         // Wait for 2 seconds then navigate to recommendations page
//         setTimeout(() => {
//           navigate("/recommendations", { state: { emotion: data.emotion } });
//         }, 2000);
//       } else {
//         console.log(data.error);
//         setError(data.error || "Error detecting emotion");
//       }
//     } catch (err) {
//       console.log(err);
//       setError("Error connecting to emotion detection server");
//     }
//     setLoading(false);
//   };

//   return (
//     // Change: Added responsive padding (px-4 sm:px-8 md:px-12) and dark mode classes to outer container.
//     <div className="min-h-screen bg-background dark:bg-backgroundLight text-primary dark:text-primaryDark flex flex-col items-center py-12 px-4 sm:px-8 md:px-12">
//       <header className="mb-8 text-center">
//         <h1 className="text-5xl font-bold">Emotion-Based Music Recommendation System</h1>
//         {/* Change: Using text-secondary for descriptive text */}
//         <p className="mt-2 text-xl text-secondary">
//           Discover music that resonates with your mood
//         </p>
//       </header>
//       {/* Change: Responsive layout: flex-col on small screens, flex-row on md and above */}
//       <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//         <div className="flex-1 p-4 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-700">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="w-full bg-gradient-to-r from-purple-700 to-pink-500 p-6 md:p-8 rounded-lg shadow-2xl"
//           >
//             {/* Change: Heading now uses text-accent to emphasize */}
//             <h2 className="text-3xl font-semibold mb-4 text-accent drop-shadow-lg">
//               Emotion Detection Area
//             </h2>
//             {/* Change: Description text using text-secondary */}
//             <p className="text-lg text-secondary text-center mb-6">
//               Click "Start Camera" to enable your webcam, then "Detect Emotion" to capture a frame.
//             </p>
//             <video
//               ref={videoRef}
//               autoPlay
//               className="w-full h-60 bg-black rounded-lg mb-4"
//               style={{ display: cameraOn ? "block" : "none" }}
//             />
//             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 // Change: Using text-primary for button text
//                 className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 text-primary font-semibold"
//                 onClick={startCamera}
//               >
//                 Start Camera
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05, backgroundColor: "#EA580C" }} // Change: Hover effect changes background to accent-hover
//                 whileTap={{ scale: 0.95 }}
//                 // Change: Using text-primary for button text
//                 className="px-4 py-2 bg-green-600 rounded-full text-primary font-semibold"
//                 onClick={handleDetectEmotion}
//                 disabled={loading}
//               >
//                 {/* Change: Using Loader component when loading */}
//                 {loading ? <Loader /> : "Detect Emotion"}
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 // Change: Using text-primary for button text
//                 className="px-4 py-2 bg-red-600 rounded-full hover:bg-red-700 text-primary font-semibold"
//                 onClick={stopCamera}
//               >
//                 Stop Camera
//               </motion.button>
//             </div>
//             {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
//             {/* Change: Using text-secondary for small helper text */}
//             <p className="text-sm text-secondary mt-4">
//               The camera will be active for 3 seconds to capture your emotion.
//             </p>
//           </motion.div>
//         </div>
//         <div className="w-full md:w-1/3 p-4 md:p-8 flex flex-col justify-center items-center">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg p-6 md:p-8 w-full text-center shadow-2xl"
//           >
//             {/* Change: Using text-accent for heading */}
//             <h3 className="text-3xl font-bold mb-4 text-accent drop-shadow-lg">
//               Your Emotion
//             </h3>
//             <p className="text-xl mb-4 text-primary">
//               Your emotion is{" "}
//               <span 
//                 className="mx-2 inline-block px-4 py-2 bg-white text-indigo-600 font-bold rounded-md border border-indigo-400 hover:text-accent-hover" 
//                 // Change: Added hover state to use accent-hover for emotion text
//               >
//                 {emotion}
//               </span>
//             </p>
//             <p className="mt-4 text-lg text-primary">
//               Based on your vibe, we’ll recommend tunes that match your mood perfectly!
//             </p>
//           </motion.div>
//         </div>
//       </div>
//       <div className="mt-8">
//         <Link to="/" className="text-orange-400 hover:underline">&larr; Back to Home</Link>
//       </div>
//     </div>
//   );
// }

// export default GetRecommendationPage;







// src/pages/GetRecommendationPage.tsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Using Loader component



function GetRecommendationPage() {
  const [emotion, setEmotion] = useState("Neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const navigate = useNavigate();




  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
  
        // ✅ Add this to ensure playback starts
        await videoRef.current.play().catch((err) => {
          console.warn("Play interrupted:", err);
        });
      }
      setCameraOn(true);
    } catch (err: any) {
      setError("Could not access camera. Please allow permissions in your browser settings.");
    }
  };
  

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const handleDetectEmotion = async () => {
    setError("");
    if (!cameraOn || !videoRef.current) {
      setError("Camera is not started. Please start the camera first.");
      return;
    }

    setLoading(true);
    // Wait 3 seconds for proper capture
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
      const imageDataUrl = canvas.toDataURL("image/jpeg");

      const response = await fetch("http://localhost:5000/api/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setEmotion(data.emotion);
        // Change: Automatically close the camera after detecting emotion
        stopCamera();
        // Wait for 2 seconds then navigate to recommendations page
        setTimeout(() => {
          navigate("/recommendations", { state: { emotion: data.emotion } });
        }, 2000);
      } else {
        console.log(data.error);
        setError(data.error || "Error detecting emotion");
      }
    } catch (err) {
      console.log(err);
      setError("Error connecting to emotion detection server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundLight text-primary dark:text-primaryDark flex flex-col items-center py-12 px-4 sm:px-8 md:px-12">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold">Emotion-Based Music Recommendation System</h1>
        <p className="mt-2 text-xl text-secondary">
          Discover music that resonates with your mood
        </p>
      </header>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-purple-700 to-pink-500 p-6 md:p-8 rounded-lg shadow-2xl"
          >
            <h2 className="text-3xl font-semibold mb-4 text-accent drop-shadow-lg">
              Emotion Detection Area
            </h2>
            <p className="text-lg text-secondary text-center mb-6">
              Click "Start Camera" to enable your webcam, then "Detect Emotion" to capture a frame.
            </p>
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-60 bg-black rounded-lg mb-4"
              style={{ display: cameraOn ? "block" : "none" }}
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 text-primary font-semibold"
                onClick={startCamera}
              >
                Start Camera
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#EA580C" }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-600 rounded-full text-primary font-semibold"
                onClick={handleDetectEmotion}
                disabled={loading}
              >
                {loading ? <Loader /> : "Detect Emotion"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 rounded-full hover:bg-red-700 text-primary font-semibold"
                onClick={stopCamera}
              >
                Stop Camera
              </motion.button>
            </div>
            {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
            <p className="text-sm text-secondary mt-4">
              The camera will be active for 3 seconds to capture your emotion.
            </p>
          </motion.div>
        </div>
        <div className="w-full md:w-1/3 p-4 md:p-8 flex flex-col justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg p-6 md:p-8 w-full text-center shadow-2xl"
          >
            <h3 className="text-3xl font-bold mb-4 text-accent drop-shadow-lg">
              Your Emotion
            </h3>
            <p className="text-xl mb-4 text-primary">
              Your emotion is{" "}
              <span 
                className="mx-2 inline-block px-4 py-2 bg-white text-indigo-600 font-bold rounded-md border border-indigo-400 hover:text-accent-hover"
              >
                {emotion}
              </span>
            </p>
            <p className="mt-4 text-lg text-primary">
              Based on your vibe, we’ll recommend tunes that match your mood perfectly!
            </p>
          </motion.div>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/" className="text-orange-400 hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default GetRecommendationPage;





