const dotenv = require('dotenv');
dotenv.config();

const { app, server } = require('./app');

// Read Config From .env File
const PORT = process.env.PORT || 3000;

// Running The Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});