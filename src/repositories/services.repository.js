import ServicesDAO from "../dao/services.dao.js";

class ServicesRepository {

  constructor() {
    this.dao = new ServicesDAO();
  }

  // Obtener servicios con filtros, paginación y ordenamiento
  async getAll(filters = {}, options = {}) {
    return await this.dao.getAll(filters, options);
  }

  // Obtener un servicio por ID
  async getById(id) {
    return await this.dao.getById(id);
  }

  // Crear un servicio
  async create(serviceData) {
    return await this.dao.create(serviceData);
  }

  // Actualizar un servicio
  async update(id, updatedData) {
    return await this.dao.update(id, updatedData);
  }

  // Eliminar un servicio
  async delete(id) {
    return await this.dao.delete(id);
  }

}

export default ServicesRepository;