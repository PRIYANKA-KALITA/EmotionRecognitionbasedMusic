// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface PaymentFormProps {
//   userId: string;
//   plan: string;
//   price: string;
// }

// const PaymentForm: React.FC<PaymentFormProps> = ({ userId, plan, price }) => {
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     // Simulate API call to backend
//     const response = await fetch('http://localhost:5000/api/payment', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, plan, price, cardNumber, expiry, cvv }),
//     });

//     const result = await response.json();
//     setLoading(false);

//     if (result.success) {
//       alert('Payment Successful!');
//       navigate('/recommendations'); // Redirect to recommendations page
//     } else {
//       alert('Payment Failed. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handlePayment} className="space-y-4">
//       <h2 className="text-xl font-bold text-white">Payment for {plan}</h2>
//       <p className="text-lg text-gray-300">Amount: {price}</p>

//       <input
//         type="text"
//         placeholder="Card Number"
//         value={cardNumber}
//         onChange={(e) => setCardNumber(e.target.value)}
//         className="w-full p-3 rounded-lg bg-gray-800 text-white"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Expiry Date (MM/YY)"
//         value={expiry}
//         onChange={(e) => setExpiry(e.target.value)}
//         className="w-full p-3 rounded-lg bg-gray-800 text-white"
//         required
//       />
//       <input
//         type="text"
//         placeholder="CVV"
//         value={cvv}
//         onChange={(e) => setCvv(e.target.value)}
//         className="w-full p-3 rounded-lg bg-gray-800 text-white"
//         required
//       />

//       <button
//         type="submit"
//         className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
//         disabled={loading}
//       >
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>
//     </form>
//   );
// };

// export default PaymentForm;