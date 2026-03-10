const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from KGL Backend!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
});