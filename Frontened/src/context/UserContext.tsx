import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: "priyanshu204060@gmail.com";
  clerk_id: "user_2uGQeqfAumNrukYyCDXn2eQAwvk";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Manage user state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user; // Return the user object
};

export const useSetUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSetUser must be used within a UserProvider");
  }
  return context.setUser; // Return the setUser function
};