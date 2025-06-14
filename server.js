// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import helmet from 'helmet'; // 🛡️ Optional but recommended for security

import { connectDB } from './config/db.js';
import corsOptions from './config/corsOptions.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import callRoutes from './routes/callRoutes.js';
import { setupSocket } from './websocket/index.js';
import { errorHandler } from './utils/errorHandler.js';

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = setupSocket(server);

// ✅ Basic security headers
app.use(helmet());

// ✅ Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Prevent body overload

// ✅ Health check route
app.get('/', (req, res) => {
  res.status(200).send('🚀 Server is running');
});

// ✅ Inject socket.io into request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/call', callRoutes);

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT ;
server.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

// ✅ Graceful Shutdown (optional)
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down');
  server.close(() => {
    console.log('🧹 HTTP server closed');
    process.exit(0);
  });
});
