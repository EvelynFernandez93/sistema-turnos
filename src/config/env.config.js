import dotenv from "dotenv";

dotenv.config();

const { PORT, NODE_ENV, MONGO_URI } = process.env;

if (!PORT) {
  throw new Error("La variable de entorno PORT es obligatoria");
}

if (!NODE_ENV) {
  throw new Error("La variable de entorno NODE_ENV es obligatoria");
}

if (!MONGO_URI) {
  throw new Error("La variable de entorno MONGO_URI es obligatoria");
}

export const env = {
  port: PORT,
  nodeEnv: NODE_ENV,
  mongoUri: MONGO_URI
};