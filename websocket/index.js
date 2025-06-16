import { Server } from "socket.io";

const userSocketMap = new Map(); // userId -> socketId mapping

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // ✅ Register userId with socket
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId; // Optional: useful for cleanup on disconnect
      console.log(`🧾 Registered user ${userId} to socket ${socket.id}`);
    });

    // ✅ Join private room
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
    });

    // ✅ Send chat message
    socket.on("sendMessage", ({ roomId, senderId, content }) => {
      socket.to(roomId).emit("receiveMessage", { senderId, content });
    });

    // ✅ Initiate call
    socket.on("callUser", ({ roomId, signalData, from, isVideo }) => {
      console.log(`📞 ${from} is calling in room ${roomId}`);
      socket.to(roomId).emit("call:user", {
        signal: signalData,
        from,
        isVideo,
      });
    });

    // ✅ Accept call
    socket.on("answerCall", ({ roomId, signal }) => {
      console.log(`✅ Call answered in room ${roomId}`);
      socket.to(roomId).emit("call:accepted", { signal });
    });

    // ✅ End call
    socket.on("endCall", ({ roomId }) => {
      console.log(`❌ Call ended in room ${roomId}`);
      socket.to(roomId).emit("call:ended");
    });

    // ✅ Cleanup on disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
        console.log(`🧹 Disconnected user ${socket.userId} (socket ${socket.id})`);
      }
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};
