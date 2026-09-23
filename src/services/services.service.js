import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

// Obtener todos los servicios
export const getServices = async (filters = {}) => {
  let services = await servicesRepository.getAll();

  const { category, available } = filters;

  // Filtrar por categoría
  if (category) {
    services = services.filter(
      (service) =>
        service.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filtrar por disponibilidad
  if (available !== undefined) {
    const availableValue = available === "true";

    services = services.filter(
      (service) => service.available === availableValue
    );
  }

  return services;
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
  // No permitimos modificar el ID de MongoDB
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