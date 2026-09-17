import {
  getServices as getServicesService,
  getServiceById as getServiceByIdService,
  createService as createServiceService,
  updateService as updateServiceService,
  deleteService as deleteServiceService
} from "../services/services.service.js";

// GET /api/services
export const getServices = async (req, res) => {
  try {
    const services = await getServicesService(req.query);

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

    const service = await getServiceByIdService(sid);

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
    const newService = await createServiceService(req.body);

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

    const updatedService = await updateServiceService(
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

    const deletedService = await deleteServiceService(sid);

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