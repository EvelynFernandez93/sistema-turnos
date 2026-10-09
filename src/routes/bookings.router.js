import express from "express";

// ==========================================
// 1. IMPORTAR CONTROLLERS
// ==========================================

import {
  createBooking,
  getBookingById,
  addServiceToBooking
} from "../controllers/bookings.controller.js";

// ==========================================
// 2. IMPORTAR MIDDLEWARE DE VALIDACIÓN
// ==========================================

import { validate } from "../middlewares/validate.middleware.js";

// ==========================================
// 3. IMPORTAR ESQUEMAS DE ZOD
// ==========================================

import {
  createBookingSchema,
  addServiceToBookingSchema,
  bookingIdParamsSchema,
  bookingServiceParamsSchema
} from "../schemas/bookings.schema.js";

// ==========================================
// 4. CREAR ROUTER
// ==========================================

const router = express.Router();

// ==========================================
// 5. RUTAS DE RESERVAS
// ==========================================

// POST /api/bookings
// Crear una nueva reserva
router.post(
  "/",
  validate(createBookingSchema),
  createBooking
);

// GET /api/bookings/:bid
// Obtener una reserva por ID
router.get(
  "/:bid",
  validate(bookingIdParamsSchema, "params"),
  getBookingById
);

// POST /api/bookings/:bid/services/:sid
// Agregar un servicio a una reserva
router.post(
  "/:bid/services/:sid",
  validate(bookingServiceParamsSchema, "params"),
  validate(addServiceToBookingSchema),
  addServiceToBooking
);

export default router;