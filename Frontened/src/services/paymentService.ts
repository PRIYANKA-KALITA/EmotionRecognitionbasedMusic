export const processPayment = async (paymentData: any) => {
  const response = await fetch('http://localhost:5000/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

  return response.json();
};