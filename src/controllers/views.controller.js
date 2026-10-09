import {
  getServices as getServicesService
} from "../services/services.service.js";

// GET /views/services
export const renderServices = async (req, res) => {
  try {

    const { results: services } = await getServicesService({
      page: 1,
      limit: 100
    });

    return res.render("services", {
      title: "Servicios disponibles",
      services: services.map((service) =>
        service.toObject ? service.toObject() : service
      )
    });

  } catch (error) {
    console.error("Error al cargar servicios:", error);

    return res.status(500).send(
      "Error al cargar los servicios"
    );
  }
};


// GET /views/availability
export const renderAvailability = async (req, res) => {
  try {

    const { results: services } = await getServicesService({
      page: 1,
      limit: 100
    });

    return res.render("availability", {
      title: "Disponibilidad de servicios",
      services: services.map((service) =>
        service.toObject ? service.toObject() : service
      )
    });

  } catch (error) {
    console.error("Error al cargar disponibilidad:", error);

    return res.status(500).send(
      "Error al cargar la disponibilidad"
    );
  }
};