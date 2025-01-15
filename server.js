const app = require('./app');

// Read Config From .env File
const PORT = process.env.PORT || 3000;

// Running The Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});