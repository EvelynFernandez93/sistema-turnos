import express from "express";
import servicesRouter from "./routes/services.router.js";

const app = express();/*Permite que Express pueda leer JSON enviado en el body de un POST o PUT. */

app.use(express.json());

app.use("/api/services", servicesRouter);

export default app;