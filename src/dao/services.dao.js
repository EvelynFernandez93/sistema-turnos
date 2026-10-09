import Service from "../models/service.model.js";

class ServicesDAO {

  // Obtener servicios con filtros, paginación y ordenamiento
  async getAll(filters = {}, options = {}) {

    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc"
    } = options;

    // Calcular cuántos documentos debemos saltar
    const skip = (page - 1) * limit;

    // Definir el orden
    const sortOrder = order === "desc" ? -1 : 1;

    // Consultar los servicios
    const services = await Service.find(filters)
      .sort({ [sortBy]: sortOrder, _id: sortOrder })
      .skip(skip)
      .limit(limit);

    // Contar el total de documentos que cumplen los filtros
    const total = await Service.countDocuments(filters);

    return {
      services,
      total
    };
  }

  // Obtener servicio por ID
  async getById(id) {
    return await Service.findById(id);
  }

  // Crear servicio
  async create(serviceData) {
    return await Service.create(serviceData);
  }

  // Actualizar servicio
  async update(id, updatedData) {
    return await Service.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );
  }

  // Eliminar servicio
  async delete(id) {
    return await Service.findByIdAndDelete(id);
  }

}

export default ServicesDAO;