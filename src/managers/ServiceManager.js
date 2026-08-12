import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(
  __dirname,
  "../data/services.json"
);

class ServiceManager {
  constructor() {
    this.path = servicesPath;
  }

  async getServices() {
    const data = await fs.readFile(this.path, "utf-8");

    return JSON.parse(data);
  }

  async getServiceById(id) {
    const services = await this.getServices();

    const service = services.find(
      (service) => service.id === Number(id)
    );

    return service || null;
  }

  async addService(serviceData) {
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

    const services = await this.getServices();

    const newId =
      services.length === 0
        ? 1
        : Math.max(...services.map((service) => service.id)) + 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    services.push(newService);

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return newService;
  }

  async updateService(id, updatedData) {
    if (Object.prototype.hasOwnProperty.call(updatedData, "id")) {
      throw new Error("No está permitido modificar el id");
    }

    const services = await this.getServices();

    const serviceIndex = services.findIndex(
      (service) => service.id === Number(id)
    );

    if (serviceIndex === -1) {
      return null;
    }

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updatedData
    };

    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2)
    );

    return services[serviceIndex];
  }

  async deleteService(id) {
    const services = await this.getServices();

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

export default ServiceManager;