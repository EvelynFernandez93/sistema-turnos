import {
  getServices as getServicesService
} from "../services/services.service.js";

// GET /views/services
export const renderServices = async (req, res) => {
  try {
    const services = await getServicesService();

    res.render("services", {
      title: "Servicios disponibles",
      services: services.map((service) =>
        service.toObject
          ? service.toObject()
          : service
      )
    });
  } catch (error) {
    res.status(500).send(
      "Error al cargar los servicios"
    );
  }
};

// GET /views/availability
export const renderAvailability = async (req, res) => {
  try {
    const services = await getServicesService();

    res.render("availability", {
      title: "Disponibilidad de servicios",
      services: services.map((service) =>
        service.toObject
          ? service.toObject()
          : service
      )
    });
  } catch (error) {
    res.status(500).send(
      "Error al cargar la disponibilidad"
    );
  }
};