import express from "express";

// Controllers
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
  updateServiceSchema,
  serviceIdParamsSchema
} from "../schemas/services.schema.js";

const router = express.Router();

// ========================================
// OBTENER TODOS LOS SERVICIOS
// GET /api/services
// ========================================

router.get("/", getServices);

// ========================================
// OBTENER SERVICIO POR ID
// GET /api/services/:sid
// ========================================

router.get(
  "/:sid",
  validate(serviceIdParamsSchema, "params"),
  getServiceById
);

// ========================================
// CREAR SERVICIO
// POST /api/services
// ========================================

router.post(
  "/",
  validate(createServiceSchema),
  createService
);

// ========================================
// ACTUALIZAR SERVICIO
// PUT /api/services/:sid
// ========================================

router.put(
  "/:sid",
  validate(serviceIdParamsSchema, "params"),
  validate(updateServiceSchema),
  updateService
);

// ========================================
// ELIMINAR SERVICIO
// DELETE /api/services/:sid
// ========================================

router.delete(
  "/:sid",
  validate(serviceIdParamsSchema, "params"),
  deleteService
);

export default router;