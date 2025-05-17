// src/components/Loader.tsx
import React from "react";
import { motion } from "framer-motion";

const loaderVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
};

function Loader() {
  return (
    <motion.div
      className="w-12 h-12 border-4 border-blue-600 border-solid rounded-full border-t-transparent"
      variants={loaderVariants}
      animate="animate"
    />
  );
}

export default Loader;
