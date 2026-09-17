import ServicesDAO from "../dao/services.dao.js";

class ServicesRepository {
  constructor() {
    this.dao = new ServicesDAO();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(serviceData) {
    return await this.dao.create(serviceData);
  }

  async update(id, updatedData) {
    return await this.dao.update(id, updatedData);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export default ServicesRepository;