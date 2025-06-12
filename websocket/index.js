import { Server } from 'socket.io';

const userSocketMap = new Map();

export const registerSocket = (userId, socket) => {
  userSocketMap.set(userId, socket.id);
};

export const removeSocket = (socketId) => {
  for (const [userId, id] of userSocketMap.entries()) {
    if (id === socketId) {
      userSocketMap.delete(userId);
      break;
    }
  }
};

export const getSocketIdByUserId = (userId) => {
  return userSocketMap.get(userId);
};

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin:process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
      registerSocket(userId, socket);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      removeSocket(socket.id);
      console.log('User disconnected:', socket.id);
    });

    socket.on('sendMessage', ({ senderId, receiverId, content }) => {
      const receiverSocketId = getSocketIdByUserId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', { senderId, content });
      }
    });

    socket.on('callUser', ({ userToCall, signalData, from }) => {
      const socketId = getSocketIdByUserId(userToCall);
      if (socketId) {
        io.to(socketId).emit('call:user', { signal: signalData, from });
      }
    });

    socket.on('answerCall', ({ to, signal }) => {
      const socketId = getSocketIdByUserId(to);
      if (socketId) {
        io.to(socketId).emit('call:accepted', { signal });
      }
    });

    socket.on('endCall', ({ to }) => {
      const socketId = getSocketIdByUserId(to);
      if (socketId) {
        io.to(socketId).emit('call:ended');
      }
    });
  });

  return io;
};
