import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../controllers/services.controller.js";

// Middleware de validación
import { validate } from "../middlewares/validate.middleware.js";

// Esquemas de Zod
import {
  createServiceSchema,
  updateServiceSchema
} from "../schemas/services.schema.js";

const router = express.Router();

// Obtener servicios
router.get("/", getServices);

// Obtener servicio por ID
router.get("/:sid", getServiceById);

// Crear servicio
router.post(
  "/",
  validate(createServiceSchema),
  createService
);

// Actualizar servicio
router.put(
  "/:sid",
  validate(updateServiceSchema),
  updateService
);

// Eliminar servicio
router.delete("/:sid", deleteService);

export default router;