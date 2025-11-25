require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Veeran Winter Cup Live System API');
});

// Routes will be added here
const teamRoutes = require('./routes/teamRoutes');
app.use('/api/teams', teamRoutes);

const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);

const refereeRoutes = require('./routes/refereeRoutes');
app.use('/api/referees', refereeRoutes);

const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);

const standingsRoutes = require('./routes/standingsRoutes');
app.use('/api/standings', standingsRoutes);

const refereeApiRoutes = require('./routes/refereeApiRoutes');
app.use('/api/referee', refereeApiRoutes);







const PORT = process.env.PORT || 5000;

const { initWebSocket } = require('./services/websocket');

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Initialize WebSocket server
  initWebSocket(server);
});