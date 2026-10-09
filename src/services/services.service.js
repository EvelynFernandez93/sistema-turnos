import ServicesRepository from "../repositories/services.repository.js";
import { ValidationError } from "../utils/ValidationError.js";

const servicesRepository = new ServicesRepository();

// Obtener servicios con filtros, paginación y ordenamiento
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

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      throw new Error("La categoría debe ser un texto válido");
    }

    // Comparación exacta, sin distinguir mayúsculas y minúsculas
    const escapedCategory = category.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filters.category = new RegExp(
      `^${escapedCategory}$`,
      "i"
    );
  }

  if (available !== undefined) {

    if (available !== "true" && available !== "false") {
      throw new Error(
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
    throw new Error(
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
    throw new Error(
      `sortBy debe ser uno de: ${allowedSortFields.join(", ")}`
    );
  }

  if (order !== "asc" && order !== "desc") {
    throw new Error(
      "El parámetro order debe ser asc o desc"
    );
  }

  // 4. Enviar filtros y opciones al Repository
  const { services, total } =
    await servicesRepository.getAll(filters, {
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      order
    });

  // 5. Calcular metadatos de paginación
  const totalPages = Math.ceil(total / limitNumber);

  return {
    results: services,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasPrevPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages
    }
  };
};


// Obtener un servicio por ID
export const getServiceById = async (id) => {
  return await servicesRepository.getById(id);
};


// Crear un nuevo servicio
export const createService = async (serviceData) => {

  const requiredFields = [
    "name",
    "description",
    "duration",
    "price",
    "category",
    "available"
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      !Object.prototype.hasOwnProperty.call(serviceData, field)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Faltan campos obligatorios: ${missingFields.join(", ")}`
    );
  }

  return await servicesRepository.create(serviceData);
};


// Actualizar un servicio
export const updateService = async (id, updatedData) => {

  if (
    Object.prototype.hasOwnProperty.call(updatedData, "id") ||
    Object.prototype.hasOwnProperty.call(updatedData, "_id")
  ) {
    throw new Error(
      "No se puede modificar el ID del servicio"
    );
  }

  return await servicesRepository.update(
    id,
    updatedData
  );
};


// Eliminar un servicio
export const deleteService = async (id) => {
  return await servicesRepository.delete(id);
};