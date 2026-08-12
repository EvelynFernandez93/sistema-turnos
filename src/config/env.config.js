import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = ["PORT", "NODE_ENV"];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(
      `Falta la variable de entorno obligatoria: ${variable}`
    );
  }
});

export const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV
};