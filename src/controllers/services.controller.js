import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

// GET /api/services
export const getServices = async (req, res) => {
  try {
    let services = await serviceManager.getServices();

    const { category, available } = req.query;

    if (category) {
      services = services.filter(
        (service) =>
          service.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (available !== undefined) {
      const availableValue = available === "true";

      services = services.filter(
        (service) => service.available === availableValue
      );
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// GET /api/services/:sid
export const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;

    const service = await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// POST /api/services
export const createService = async (req, res) => {
  try {
    const newService = await serviceManager.addService(req.body);

    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// PUT /api/services/:sid
export const updateService = async (req, res) => {
  try {
    const { sid } = req.params;

    const updatedService = await serviceManager.updateService(
      sid,
      req.body
    );

    if (!updatedService) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// DELETE /api/services/:sid
export const deleteService = async (req, res) => {
  try {
    const { sid } = req.params;

    const deletedService = await serviceManager.deleteService(sid);

    if (!deletedService) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(deletedService);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};