import app from "./src/app.js";
import { env } from "./src/config/env.config.js";
import { connectDB } from "./src/config/db.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Servidor escuchando en el puerto ${env.port}`);
  });
};

startServer();