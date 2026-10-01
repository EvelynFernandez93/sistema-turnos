let io;

export const setSocketServer = (socketServer) => {
  io = socketServer;
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io todavía no fue inicializado");
  }

  return io;
};