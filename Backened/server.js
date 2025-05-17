const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/payment', (req, res) => {
  const { plan, price, cardNumber, expiry, cvv } = req.body;

  // Simulate payment processing
  if (cardNumber && expiry && cvv) {
    return res.json({ success: true, message: 'Payment processed successfully!' });
  } else {
    return res.json({ success: false, message: 'Payment failed. Invalid details.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});