import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SocketManager } from './core/SocketManager';

const app = express();
const httpServer = http.createServer(app);

// Setup CORS for frontend access
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust for your frontend URL
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.send('PartyHub Backend is running!');
});

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize the Socket Manager to handle all real-time logic
new SocketManager(io);

export { httpServer, app };