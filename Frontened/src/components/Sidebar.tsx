


// import React from 'react';
// import { Home, Grid, Crown, LogOut, Music2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useClerk } from '@clerk/clerk-react';

// interface SidebarProps {
//   onSubscriptionClick: () => void;
// }

// const Sidebar = ({ onSubscriptionClick }: SidebarProps) => {
//   const { signOut } = useClerk();

//   return (
//     <motion.div
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       className="w-20 md:w-64 h-screen bg-[#1B1B1B] fixed left-0 top-0 border-r border-white/10"
//     >
//       <div className="p-4 mb-8">
//         <div className="flex items-center space-x-2 px-4">
//           <Music2 className="h-8 w-8 text-orange-500" />
//           <span className="text-xl font-bold text-white hidden md:block">
//             Thrillbit
//           </span>
//         </div>
//       </div>

//       <nav className="space-y-2 px-2 flex flex-col h-full">
//         <NavItem icon={<Home />} text="Home" isActive />
//         <NavItem icon={<Grid />} text="Categories" />
//         <NavItem icon={<Crown />} text="Subscription" onClick={onSubscriptionClick} />
//         <div className="flex-grow" />
//         <NavItem icon={<LogOut />} text="Logout" onClick={signOut} className="mt-auto" />
//       </nav>
//     </motion.div>
//   );
// };

// interface NavItemProps {
//   icon: React.ReactNode;
//   text: string;
//   isActive?: boolean;
//   onClick?: () => void;
//   className?: string;
// }

// const NavItem = ({
//   icon,
//   text,
//   isActive,
//   onClick,
//   className = '',
// }: NavItemProps) => (
//   <motion.button
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     onClick={onClick}
//     className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-300
//                ${isActive 
//                  ? 'bg-orange-500/10 text-orange-500' 
//                  : 'text-gray-400 hover:text-white hover:bg-white/5'} 
//                ${className}`}
//   >
//     <span className="flex-shrink-0">{icon}</span>
//     <span className="hidden md:block">{text}</span>
//   </motion.button>
// );

// export default Sidebar;




import React from 'react';
import { Home, Grid, Crown, LogOut, Music2, UserPlus } from 'lucide-react'; // Added UserPlus for the icon
import { motion } from 'framer-motion';
import { useClerk, useUser } from '@clerk/clerk-react'; // Import Clerk hooks

interface SidebarProps {
  onSubscriptionClick: () => void;
}

const Sidebar = ({ onSubscriptionClick }: SidebarProps) => {
  const { signOut } = useClerk();
  const { user } = useUser(); // Move useUser to the top level of the component

  // Function to handle creating a test user
  const handleCreateTestUser = async () => {
    if (!user) {
      alert("User is not logged in.");
      return;
    }

    // Extract user details from Clerk
    const clerk_id = user.id; // Clerk's unique ID for the user
    const full_name = user.fullName || "Default Name"; // Full name of the user
    const email = user.primaryEmailAddress?.emailAddress || "default@example.com"; // User's email address

    // Prepare the payload
    const payload = {
      clerk_id,
      full_name,
      email,
      favoriteGenre: "pop", // Default value for favorite genre
    };

    console.log("Payload:", payload); // Debugging: Log the payload

    try {
      const response = await fetch("http://localhost:5000/api/create_test_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send user details to the backend
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Test user created:", data);
        alert(`Test user created with ID: ${data.user_id}`);
        localStorage.setItem("user_id", data.user_id); // Store user_id in local storage
      } else {
        const errorData = await response.json();
        console.error("Test user already exists:", errorData);      alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating test user:", error);
      alert("An error occurred while creating the test user.");
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 md:w-64 h-screen bg-[#1B1B1B] fixed left-0 top-0 border-r border-white/10"
    >
      <div className="p-4 mb-8">
        <div className="flex items-center space-x-2 px-4">
          <Music2 className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold text-white hidden md:block">
            Thrillbit
          </span>
        </div>
      </div>

      <nav className="space-y-2 px-2 flex flex-col h-full">
        <NavItem icon={<Home />} text="Home" isActive />
        <NavItem icon={<Grid />} text="Categories" />
        <NavItem icon={<Crown />} text="Subscription" onClick={onSubscriptionClick} />
        <div className="flex-grow" />
        {/* Added Create Test User as a NavItem */}
        <NavItem icon={<UserPlus />} text="Create Test User" onClick={handleCreateTestUser} />
        <NavItem icon={<LogOut />} text="Logout" onClick={signOut} className="mt-auto" />
      </nav>
    </motion.div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem = ({
  icon,
  text,
  isActive,
  onClick,
  className = '',
}: NavItemProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-300
               ${isActive 
                 ? 'bg-orange-500/10 text-orange-500' 
                 : 'text-gray-400 hover:text-white hover:bg-white/5'} 
               ${className}`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="hidden md:block">{text}</span>
  </motion.button>
);

export default Sidebar;