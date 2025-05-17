import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubscriptionPage() {
  const navigate = useNavigate();

  // 📝 State for payment form fields
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    plan: "1 month", // Default plan
    amount: 300, // Default amount for "1 month" in rupees
  });

  // 🚨 State for validation error messages
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🖊️ Handle input change and perform real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "plan" && { amount: value === "1 month" ? 300 : 2000 }), // Update amount dynamically
    }));

    // Validation for numeric fields
    if (name === "cardNumber" || name === "cvc") {
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Only numbers allowed" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (name === "expiryDate") {
      if (!/^[\d/]*$/.test(value)) {
        setErrors((prev) => ({ ...prev, expiryDate: "Format should be MM/YY" }));
      } else if (value.length > 5) {
        setErrors((prev) => ({ ...prev, expiryDate: "Maximum 5 characters allowed" }));
      } else {
        setErrors((prev) => ({ ...prev, expiryDate: "" }));
      }
    }
  };

  // 🚀 Handle form submission and call backend API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final check for validation errors
    const hasErrors = Object.values(errors).some((msg) => msg !== "");
    if (hasErrors) {
      alert("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 😊 Get dynamic user ID from localStorage
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        alert("User not logged in.");
        setIsSubmitting(false);
        return;
      }

      // 🛠️ Call backend to update subscription
      const response = await fetch("http://localhost:5000/api/update-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id, // using dynamic user ID from localStorage 😊
          plan: formData.plan,
          amount: formData.amount,
        }),
      });


      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      

      alert("Subscription successful!");
      navigate("/");
    } catch (error) {
      console.error("Error in subscription:", error);
      alert("Subscription failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundLight text-indigo-800 dark:text-indigo-900 py-12 px-4 flex items-center justify-center">
      <div className="bg-gray-900 text-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Upgrade Your Plan
          </h1>
          <p className="mb-8 text-gray-300">
            Emotion-Based Music Recommendation System Premium
          </p>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label className="block font-medium mb-1 text-indigo-800">
                Select Plan *
              </label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 bg-gray-800 text-white"
                required
              >
                <option value="1 month">1 Month - ₹300</option>
                <option value="1 year">1 Year - ₹2000</option>
              </select>
            </div>

            {/* Card Number */}
            <div>
              <label className="block font-medium mb-1 text-indigo-800">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                className="w-full border border-gray-300 rounded p-2 bg-gray-800 text-white"
                required
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry Date and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-indigo-800">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded p-2 bg-gray-800 text-white"
                  required
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1 text-indigo-800">
                  CVC *
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full border border-gray-300 rounded p-2 bg-gray-800 text-white"
                  required
                />
                {errors.cvc && (
                  <p className="text-red-500 text-sm">{errors.cvc}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-accent text-white font-semibold rounded hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;