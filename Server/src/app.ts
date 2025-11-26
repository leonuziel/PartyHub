import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SocketManager } from './core/SocketManager.js';

const port = process.env.PORT || 4001

const app = express();
const httpServer = http.createServer(app);

// Setup CORS for frontend access
app.use(cors({ 
    origin: ['http://localhost:3000', 'https://partyhub.onrender.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

import debugRoutes from './routes/debug.js';
import gameConfigRoutes from './routes/gameConfig.js';

// Basic welcome route
app.get('/', (req, res) => {
  res.send('PartyHub Backend is running!');
});

app.use('/debug', debugRoutes);
app.use('/api/game-configs', gameConfigRoutes);

// Generic error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ["https://partyhub.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Initialize the Socket Manager to handle all real-time logic
new SocketManager(io);

export { httpServer, app };