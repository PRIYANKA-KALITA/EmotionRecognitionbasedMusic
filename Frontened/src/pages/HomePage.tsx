

// src/pages/HomePage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import MusicGrid from "../components/MusicGrid";
import SubscriptionModal from "../components/SubscriptionModal";

const mockSongs = [
  {
    id: "1",
    title: "Echoes of Midnight",
    artist: "Jon Hickman",
    coverUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909",
    duration: "3:45",
  },
  {
    id: "2",
    title: "Waves of Time",
    artist: "Lana Rivers",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    duration: "4:20",
  },
  {
    id: "3",
    title: "Electric Dreams",
    artist: "Mia Lowell",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    duration: "3:56",
  },
];

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, openSignIn } = useClerk();

  const handleGetRecommendations = () => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      navigate("/getRecommendation");
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: -50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };




  return (
    // Wrapping entire content with motion.div and applying dark mode classes from Tailwind config.
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-background dark:bg-backgroundLight text-white dark:text-primaryDark"
    >


      <Sidebar onSubscriptionClick={() => setIsSubscriptionModalOpen(true)} />
      <Header />
      <main className="pl-4 sm:pl-20 md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Removed the duplicate search bar here, since search is only in the Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Discover Your Perfect Sound
            </h1>
            {/* Using text-secondary for descriptive text */}
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Let our AI-powered recommendations find the perfect music for your mood
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#EA580C" }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-300"
              onClick={handleGetRecommendations}
            >
              Get Recommendations
            </motion.button>
          </motion.div>

          <div className="mb-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <MusicGrid songs={mockSongs} />
        </div>
      </main>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </motion.div>
  );
}

export default HomePage;
