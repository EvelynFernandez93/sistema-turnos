import mongoose from "mongoose";

// ========================================
// ESQUEMA DE SERVICIOS
// ========================================

const serviceSchema = new mongoose.Schema(
  {
    // Nombre del servicio
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [1, "El nombre no puede estar vacío"]
    },

    // Descripción del servicio
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [1, "La descripción no puede estar vacía"]
    },

    // Duración del servicio en minutos
    duration: {
      type: Number,
      required: [true, "La duración es obligatoria"],
      min: [1, "La duración debe ser mayor a 0"],
      validate: {
        validator: Number.isInteger,
        message: "La duración debe ser un número entero"
      }
    },

    // Precio del servicio
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },

    // Categoría del servicio
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      minlength: [1, "La categoría no puede estar vacía"]
    },

    // Disponibilidad
    available: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// ========================================
// MODELO DE MONGOOSE
// ========================================

const Service = mongoose.model(
  "Service",
  serviceSchema
);

export default Service;