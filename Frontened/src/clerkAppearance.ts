// src/clerkAppearance.ts

export const clerkAppearance = {
  baseTheme: "dark",
  variables: {
    colorBackground: "#0d0d0d",         // Very dark background
    colorPrimary: "#FF6D00",            // Vibrant orange accent
    colorText: "#E0E0E0",               // Light grey text
    colorTextOnPrimary: "#FFFFFF",      // White text on primary buttons
    colorInputBackground: "#1E1E1E",    // Input field background
    colorInputText: "#FFFFFF",          // Input text color
    colorButtonPrimary: "#FF6D00",      // Primary button background
    colorButtonText: "#FFFFFF",         // Primary button text
    colorDanger: "#E53935",             // For errors
    colorSuccess: "#4CAF50",            // For success messages
  },
  elements: {
    card: {
      backgroundColor: "#1A1A1A",      
      boxShadow: "0px 8px 16px rgba(255, 109, 0, 0.4)",
      borderRadius: "16px",
      border: "1px solid #333333",
    },
    headerTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "26px",
      fontWeight: "700",
      color: "#FF6D00",
    },
    buttonPrimary: {
      borderRadius: "10px",
      fontFamily: "'Roboto', sans-serif",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "#E65100",
        transform: "scale(1.02)",
      },
    },
    input: {
      borderRadius: "8px",
      border: "1px solid #FF6D00",
      backgroundColor: "#1E1E1E",
      color: "#FFFFFF",
      fontFamily: "'Roboto', sans-serif",
      ":focus": {
        borderColor: "#FF9800",
        boxShadow: "0 0 8px rgba(255, 109, 0, 0.5)",
      },
    },
    divider: {
      borderColor: "#333333",
    },
    errorText: {
      color: "#E53935",
      fontSize: "14px",
      fontFamily: "'Roboto', sans-serif",
    },
  },
};
