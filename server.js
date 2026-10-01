import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import { env } from "./src/config/env.config.js";
import { connectDB } from "./src/config/db.config.js";
import { setSocketServer } from "./src/config/socket.config.js";

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = new Server(httpServer);

  // Guardamos la instancia de Socket.io
  setSocketServer(io);

  io.on("connection", (socket) => {
    console.log("Cliente conectado mediante Socket.io");

    socket.on("disconnect", () => {
      console.log("Cliente desconectado de Socket.io");
    });
  });

  httpServer.listen(env.port, () => {
    console.log(`Servidor escuchando en el puerto ${env.port}`);
  });
};

startServer();