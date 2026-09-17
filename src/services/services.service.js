import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

export const getServices = async () => {
  return await servicesRepository.getAll();
};

export const getServiceById = async (id) => {
  return await servicesRepository.getById(id);
};

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

export const updateService = async (id, updatedData) => {
  if (
    Object.prototype.hasOwnProperty.call(updatedData, "id")
  ) {
    throw new Error("No se puede modificar el ID del servicio");
  }

  return await servicesRepository.update(id, updatedData);
};

export const deleteService = async (id) => {
  return await servicesRepository.delete(id);
};