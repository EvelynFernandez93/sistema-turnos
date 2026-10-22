import { z } from "zod";

// ========================================
// ESQUEMA BASE DE SERVICIOS
// ========================================

const serviceSchema = z.strictObject({

  // Nombre del servicio
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  // Descripción del servicio
  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  // Duración en minutos
  duration: z
    .number()
    .int("La duración debe ser un número entero")
    .positive("La duración debe ser mayor a 0"),

  // Precio del servicio
  price: z
    .number()
    .min(0, "El precio no puede ser negativo"),

  // Categoría
  category: z
    .string()
    .trim()
    .min(1, "La categoría es obligatoria"),

  // Disponibilidad
  available: z
    .boolean({
      error: "La disponibilidad debe ser true o false"
    })

});

// ========================================
// CREAR SERVICIO
// POST /api/services
// ========================================

// Todos los campos son obligatorios

export const createServiceSchema = serviceSchema;

// ========================================
// ACTUALIZAR SERVICIO
// PUT /api/services/:sid
// ========================================

// Permite actualizar uno o varios campos
// sin necesidad de enviar el objeto completo

export const updateServiceSchema = serviceSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe proporcionar al menos un campo para actualizar"
    }
  );

// ========================================
// VALIDAR ID DE MONGODB
// GET, PUT Y DELETE /api/services/:sid
// ========================================

export const serviceIdParamsSchema = z.strictObject({

  sid: z
    .string()
    .regex(
      /^[a-fA-F0-9]{24}$/,
      "El ID debe ser un ObjectId válido de MongoDB"
    )

});