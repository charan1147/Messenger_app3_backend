const users = new Map();

export const registerSocket = (userId, socket) => {
  users.set(userId, socket.id);
};

export const getSocketId = (userId) => {
  return users.get(userId);
};

export const removeSocket = (socketId) => {
  for (const [userId, sId] of users.entries()) {
    if (sId === socketId) {
      users.delete(userId);
      break;
    }
  }
};
