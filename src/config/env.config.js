import dotenv from "dotenv";

dotenv.config();

// ========================================
// OBTENER VARIABLES DE ENTORNO
// ========================================

const { PORT, NODE_ENV, MONGO_URI } = process.env;

// ========================================
// VALIDAR VARIABLES OBLIGATORIAS
// ========================================

if (!PORT) {
  throw new Error(
    "La variable de entorno PORT es obligatoria"
  );
}

if (!NODE_ENV) {
  throw new Error(
    "La variable de entorno NODE_ENV es obligatoria"
  );
}

if (!MONGO_URI) {
  throw new Error(
    "La variable de entorno MONGO_URI es obligatoria"
  );
}

// ========================================
// VALIDAR PUERTO
// ========================================

const port = Number(PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(
    "PORT debe ser un número entero entre 1 y 65535"
  );
}

// ========================================
// VALIDAR ENTORNO
// ========================================

const validEnvironments = [
  "development",
  "production",
  "test"
];

if (!validEnvironments.includes(NODE_ENV)) {
  throw new Error(
    "NODE_ENV debe ser development, production o test"
  );
}

// ========================================
// EXPORTAR CONFIGURACIÓN
// ========================================

export const env = {
  port,
  nodeEnv: NODE_ENV,
  mongoUri: MONGO_URI
};