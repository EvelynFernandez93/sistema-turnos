import { z } from "zod";

// ==========================================
// VALIDACIÓN PARA CREAR UN SERVICIO
// ==========================================

export const createServiceSchema = z.strictObject({

  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  duration: z
    .number()
    .positive("La duración debe ser mayor a 0"),

  price: z
    .number()
    .nonnegative("El precio no puede ser negativo"),

  category: z
    .string()
    .trim()
    .min(1, "La categoría es obligatoria"),

  available: z.boolean()

});

// ==========================================
// VALIDACIÓN PARA ACTUALIZAR UN SERVICIO
// ==========================================

export const updateServiceSchema = createServiceSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debés enviar al menos un campo para actualizar"
    }
  );