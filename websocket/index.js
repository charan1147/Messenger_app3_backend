import { Server } from 'socket.io';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // ✅ Join private room (caller and receiver both should emit this)
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // ✅ Send message
    socket.on('sendMessage', ({ roomId, senderId, content }) => {
      socket.to(roomId).emit('receiveMessage', { senderId, content });
    });

    // ✅ Call initiated
    socket.on('callUser', ({ roomId, signalData, from, isVideo }) => {
      socket.to(roomId).emit('call:user', {
        signal: signalData,
        from,
        isVideo,
      });
    });

    // ✅ Call answered
    socket.on('answerCall', ({ roomId, signal }) => {
      socket.to(roomId).emit('call:accepted', { signal });
    });

    // ✅ Call ended
    socket.on('endCall', ({ roomId }) => {
      socket.to(roomId).emit('call:ended');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
