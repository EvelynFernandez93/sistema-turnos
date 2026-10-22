import ServicesRepository from "../repositories/services.repository.js";
import { ValidationError } from "../utils/ValidationError.js";

const servicesRepository = new ServicesRepository();

// ========================================
// OBTENER SERVICIOS
// Filtros, paginación y ordenamiento
// ========================================

export const getServices = async (query = {}) => {
  const {
    category,
    available,
    page = 1,
    limit = 10,
    sortBy = "name",
    order = "asc"
  } = query;

  // 1. Construir filtros para MongoDB
  const filters = {};

  // Filtrar por categoría
  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      !category.trim()
    ) {
      throw new ValidationError(
        "La categoría debe ser un texto válido"
      );
    }

    // Escapar caracteres especiales de RegExp
    const escapedCategory = category
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Comparación exacta sin distinguir mayúsculas
    filters.category = new RegExp(
      `^${escapedCategory}$`,
      "i"
    );
  }

  // Filtrar por disponibilidad
  if (available !== undefined) {
    if (
      available !== "true" &&
      available !== "false"
    ) {
      throw new ValidationError(
        "El parámetro available debe ser true o false"
      );
    }

    filters.available = available === "true";
  }

  // 2. Validar paginación
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (
    !Number.isSafeInteger(pageNumber) ||
    pageNumber < 1
  ) {
    throw new ValidationError(
      "El parámetro page debe ser un número entero mayor a 0"
    );
  }

  if (
    !Number.isSafeInteger(limitNumber) ||
    limitNumber < 1 ||
    limitNumber > 100
  ) {
    throw new ValidationError(
      "El parámetro limit debe ser un número entero entre 1 y 100"
    );
  }

  // 3. Validar ordenamiento
  const allowedSortFields = [
    "name",
    "price",
    "duration",
    "category",
    "createdAt"
  ];

  if (!allowedSortFields.includes(sortBy)) {
    throw new ValidationError(
      `sortBy debe ser uno de: ${allowedSortFields.join(", ")}`
    );
  }

  if (order !== "asc" && order !== "desc") {
    throw new ValidationError(
      "El parámetro order debe ser asc o desc"
    );
  }

  // 4. Consultar al Repository
  const { services, total } =
    await servicesRepository.getAll(filters, {
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      order
    });

  // 5. Calcular información de paginación
  const totalPages = Math.ceil(total / limitNumber);

  return {
    results: services,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasPrevPage: pageNumber > 1 && totalPages > 0,
      hasNextPage: pageNumber < totalPages
    }
  };
};

// ========================================
// OBTENER UN SERVICIO POR ID
// ========================================

export const getServiceById = async (id) => {
  return await servicesRepository.getById(id);
};

// ========================================
// CREAR UN SERVICIO
// ========================================

export const createService = async (serviceData) => {
  const requiredFields = [
    "name",
    "description",
    "duration",
    "price",
    "category",
    "available"
  ];

  // Verificar campos obligatorios
  const missingFields = requiredFields.filter(
    (field) =>
      !Object.prototype.hasOwnProperty.call(
        serviceData,
        field
      )
  );

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Faltan campos obligatorios: ${missingFields.join(", ")}`
    );
  }

  return await servicesRepository.create(serviceData);
};

// ========================================
// ACTUALIZAR UN SERVICIO
// ========================================

export const updateService = async (id, updatedData) => {
  // Impedir modificación de identificadores
  if (
    Object.prototype.hasOwnProperty.call(
      updatedData,
      "id"
    ) ||
    Object.prototype.hasOwnProperty.call(
      updatedData,
      "_id"
    )
  ) {
    throw new ValidationError(
      "No se puede modificar el ID del servicio"
    );
  }

  return await servicesRepository.update(
    id,
    updatedData
  );
};

// ========================================
// ELIMINAR UN SERVICIO
// ========================================

export const deleteService = async (id) => {
  return await servicesRepository.delete(id);
};