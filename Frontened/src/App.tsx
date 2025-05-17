
// // src/app.tsx
// // src/App.tsx
// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import HomePage from "./pages/HomePage";
// import GetRecommendationPage from "./pages/GetRecommendationPage";
// import RecommendationsPage from "./pages/RecommendationsPage";
// import Player from "./pages/Player";
// import SubscriptionPage from "./pages/SubscriptionPage"; // <-- New import



// function App() {
//   const location = useLocation();

//   return (
//     // AnimatePresence enables exit animations on route change.
//     <AnimatePresence exitBeforeEnter>
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/player" element={<Player />} />

//         <Route path="/getRecommendation" element={<GetRecommendationPage />} />
//         <Route path="/recommendations" element={<RecommendationsPage />} />
//               {/* New: Subscription route */}
//       <Route path="/subscription" element={<SubscriptionPage />} />

//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default App;


// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import HomePage from "./pages/HomePage";
// import GetRecommendationPage from "./pages/GetRecommendationPage";
// import RecommendationsPage from "./pages/RecommendationsPage";
// import Player from "./pages/Player";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import RazorpaySubscriptionPage from "./pages/RazorpaySubscriptionPage"; // ✅ Add this line
// import { UserProvider } from "./context/UserContext"; // Adjust the path as needed


// function App() {
//   const location = useLocation();

//   return (
//     <AnimatePresence exitBeforeEnter>
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/player" element={<Player />} />
//         <Route path="/getRecommendation" element={<GetRecommendationPage />} />
//         <Route path="/recommendations" element={<RecommendationsPage />} />
//         <Route path="/subscription" element={<SubscriptionPage />} />
//         <Route path="/razorpay-subscription" element={<RazorpaySubscriptionPage />} /> {/* ✅ Add this route */}
//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default App;


import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import GetRecommendationPage from "./pages/GetRecommendationPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import Player from "./pages/Player";
import SubscriptionPage from "./pages/SubscriptionPage";
import RazorpaySubscriptionPage from "./pages/RazorpaySubscriptionPage"; // ✅ Add this line
import { UserProvider } from "./context/UserContext"; // Adjust the path as needed

function App() {
  const location = useLocation();

  return (
    <UserProvider> {/* Wrap the entire app with UserProvider */}
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/player" element={<Player />} />
          <Route path="/getRecommendation" element={<GetRecommendationPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/razorpay-subscription" element={<RazorpaySubscriptionPage />} /> {/* ✅ Add this route */}
        </Routes>
      </AnimatePresence>
    </UserProvider>
  );
}

export default App;