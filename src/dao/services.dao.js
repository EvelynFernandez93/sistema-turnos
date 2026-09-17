import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(
  __dirname,
  "../data/services.json"
);

class ServicesDAO {
  constructor() {
    this.path = servicesPath;
  }

  async getAll() {
    const data = await fs.readFile(this.path, "utf-8");

    return JSON.parse(data);
  }

  async getById(id) {
    const services = await this.getAll();

    const service = services.find(
      (service) => service.id === Number(id)
    );

    return service || null;
  }

  async create(serviceData) {
    const services = await this.getAll();

    const newId =
      services.length === 0
        ? 1
        : Math.max(...services.map((service) => service.id)) + 1;

    const newService = {
      id: newId,
      ...serviceData
    };

    services.push(newService);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return newService;
  }

  async update(id, updatedData) {
    const services = await this.getAll();

    const serviceIndex = services.findIndex(
      (service) => service.id === Number(id)
    );

    if (serviceIndex === -1) {
      return null;
    }

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updatedData,
      id: services[serviceIndex].id
    };

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return services[serviceIndex];
  }

  async delete(id) {
    const services = await this.getAll();

    const serviceIndex = services.findIndex(
      (service) => service.id === Number(id)
    );

    if (serviceIndex === -1) {
      return null;
    }

    const [deletedService] = services.splice(serviceIndex, 1);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return deletedService;
  }
}

export default ServicesDAO;