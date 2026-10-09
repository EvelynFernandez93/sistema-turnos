import { z } from "zod";

// ==========================================
// 1. VALIDACIÓN DE OBJECTID DE MONGODB
// ==========================================

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    "El ID debe ser un ObjectId válido de MongoDB"
  );


// ==========================================
// 2. VALIDACIÓN DE SERVICIOS EN UNA RESERVA
// ==========================================

const bookingServiceSchema = z.strictObject({
  service: objectIdSchema,

  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
});


// ==========================================
// 3. CREAR UNA RESERVA
// POST /api/bookings
// ==========================================

export const createBookingSchema = z.strictObject({

  clientName: z
    .string()
    .trim()
    .min(1, "El nombre del cliente es obligatorio"),

  clientEmail: z
    .email("El email no tiene un formato válido"),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La fecha debe tener el formato YYYY-MM-DD"
    ),

  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "La hora debe tener el formato HH:mm"
    ),

  status: z.enum([
    "pending",
    "confirmed",
    "cancelled"
  ]),

  // Al crear la reserva, los servicios deben estar vacíos.
  // Se agregan posteriormente mediante otro endpoint.
  services: z
    .array(bookingServiceSchema)
    .length(
      0,
      "Los servicios deben agregarse mediante el endpoint correspondiente"
    )
    .optional()

});


// ==========================================
// 4. AGREGAR UN SERVICIO A UNA RESERVA
// POST /api/bookings/:bid/services/:sid
// ==========================================

export const addServiceToBookingSchema = z.strictObject({

  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .default(1)

});


// ==========================================
// 5. VALIDAR ID DE UNA RESERVA
// GET /api/bookings/:bid
// ==========================================

export const bookingIdParamsSchema = z.strictObject({

  bid: objectIdSchema

});


// ==========================================
// 6. VALIDAR IDS DE RESERVA Y SERVICIO
// POST /api/bookings/:bid/services/:sid
// ==========================================

export const bookingServiceParamsSchema = z.strictObject({

  bid: objectIdSchema,

  sid: objectIdSchema

});