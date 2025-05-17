// src/components/Button.tsx
import React, { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

// Define the props, extending the standard button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
}

// Create a mapping for variant classes using Tailwind utility classes.
const variantClasses: Record<string, string> = {
  primary: "bg-primary text-background hover:bg-primaryDark",
  secondary: "bg-secondary text-background hover:bg-gray-600",
  accent: "bg-accent text-background hover:bg-accent-hover",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    // Use Framer Motion for interactive hover and tap animations
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded font-semibold transition-colors duration-300 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;


// Explanation:

// Consistent Styles:
// The Button component uses a predefined set of classes from the variantClasses mapping. This ensures that every time you use the Button with variant="primary", it has a consistent look.

// Interactivity:
// Framer Motion is used to add subtle scale animations on hover and tap.

// Extendable:
// You can extend this component with more variants or additional properties as needed.

