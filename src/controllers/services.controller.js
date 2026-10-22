import { getSocketServer } from "../config/socket.config.js";

import {
  getServices as getServicesService,
  getServiceById as getServiceByIdService,
  createService as createServiceService,
  updateService as updateServiceService,
  deleteService as deleteServiceService
} from "../services/services.service.js";

// ========================================
// OBTENER SERVICIOS
// GET /api/services
// ========================================

export const getServices = async (req, res) => {
  try {
    const result = await getServicesService(req.query);

    return res.status(200).json(result);

  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error("Error al obtener servicios:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};

// ========================================
// OBTENER SERVICIO POR ID
// GET /api/services/:sid
// ========================================

export const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;

    const service = await getServiceByIdService(sid);

    if (!service) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    return res.status(200).json(service);

  } catch (error) {
    console.error("Error al obtener servicio:", error);

    return res.status(500).json({
      error: "Error interno al obtener el servicio"
    });
  }
};

// ========================================
// CREAR SERVICIO
// POST /api/services
// ========================================

export const createService = async (req, res) => {
  try {
    const newService = await createServiceService(req.body);

    // Notificar a los clientes conectados
    const io = getSocketServer();

    io.emit("serviceCreated", {
      message: "Se creó un nuevo servicio",
      service: newService
    });

    return res.status(201).json(newService);

  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error("Error al crear servicio:", error);

    return res.status(500).json({
      error: "Error interno al crear el servicio"
    });
  }
};

// ========================================
// ACTUALIZAR SERVICIO
// PUT /api/services/:sid
// ========================================

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

    return res.status(200).json(updatedService);

  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error("Error al actualizar servicio:", error);

    return res.status(500).json({
      error: "Error interno al actualizar el servicio"
    });
  }
};

// ========================================
// ELIMINAR SERVICIO
// DELETE /api/services/:sid
// ========================================

export const deleteService = async (req, res) => {
  try {
    const { sid } = req.params;

    const deletedService = await deleteServiceService(sid);

    if (!deletedService) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    return res.status(200).json(deletedService);

  } catch (error) {
    console.error("Error al eliminar servicio:", error);

    return res.status(500).json({
      error: "Error interno al eliminar el servicio"
    });
  }
};