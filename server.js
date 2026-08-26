import app from "./src/app.js";
import { env } from "./src/config/env.config.js";

app.listen(env.port, () => {
  console.log(`Servidor escuchando en el puerto ${env.port}`);
});