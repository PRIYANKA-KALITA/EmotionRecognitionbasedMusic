import React from 'react';
import PaymentForm from '../components/PaymentForm';

const PaymentPage: React.FC = () => {
  const handlePaymentSuccess = () => {
    // Redirect or show success message
    alert('Payment completed successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <PaymentForm plan="Premium" price="$9.99" onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default PaymentPage;