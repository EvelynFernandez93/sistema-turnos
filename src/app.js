import { env } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

console.log("Aplicación iniciada correctamente");
console.log(`Puerto: ${env.port}`);
console.log(`Entorno: ${env.nodeEnv}`);

const services = await serviceManager.getServices();

console.log("Servicios:", services);