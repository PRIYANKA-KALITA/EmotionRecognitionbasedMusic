import React from "react";
import { useNavigate } from "react-router-dom";

const RazorpaySubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRazorpayPayment = async () => {
    try {
      // Call backend to create Razorpay order
      const response = await fetch("http://localhost:5000/api/create_checkout_session-razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50000 }) // ₹500.00 in paise
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create Razorpay order.");
      }

      // Razorpay payment options
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Premium Subscription",
        description: "Upgrade to premium for unlimited music access!",
        handler: async function (response: any) {
          // Call backend to update subscription after successful payment
          const updateResponse = await fetch("http://localhost:5000/api/update-subscription-razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              user_id: localStorage.getItem("user_id") // Pass user ID from localStorage
            })
          });

          const updateData = await updateResponse.json();

          if (!updateResponse.ok) {
            throw new Error(updateData.error || "Failed to update subscription.");
          }

          alert("Payment successful! You are now a premium user!");
          navigate("/"); // Redirect to home page
        },
        prefill: {
          name: "Music Lover",
          email: "user@example.com"
        },
        theme: {
          color: "#F97316" // Use the accent color from Tailwind theme
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-backgroundLight dark:bg-background">
      <h1 className="text-4xl font-bold mb-6 text-primary dark:text-primaryDark">
        🎧 Unlock Premium
      </h1>
      <p className="text-lg text-secondary mb-8">
        Upgrade now for unlimited music access! 💸
      </p>
      <button
        onClick={handleRazorpayPayment}
        className="bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Pay with Razorpay 💸
      </button>
    </div>
  );
};

export default RazorpaySubscriptionPage;