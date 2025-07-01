import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SocketManager } from './core/SocketManager.js';

const port = process.env.PORT || 4000 

const app = express();
const httpServer = http.createServer(app);

// Setup CORS for frontend access
app.use(cors({ origin: 'https://partyhub.onrender.com'})); // Adjust for your frontend URL
app.use(express.json());

import debugRoutes from './routes/debug.js';

// Basic welcome route
app.get('/', (req, res) => {
  res.send('PartyHub Backend is running!');
});

app.use('/debug', debugRoutes);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "https://partyhub.onrender.com",
    methods: ["GET", "POST"]
  }
});

// Initialize the Socket Manager to handle all real-time logic
new SocketManager(io);

export { httpServer, app };