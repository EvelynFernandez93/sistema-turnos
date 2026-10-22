import {
  createBooking as createBookingService,
  getBookingById as getBookingByIdService,
  addServiceToBooking as addServiceToBookingService
} from "../services/bookings.service.js";

// ========================================
// CREAR UNA NUEVA RESERVA
// POST /api/bookings
// ========================================

export const createBooking = async (req, res) => {
  try {
    const newBooking = await createBookingService(req.body);

    return res.status(201).json(newBooking);

  } catch (error) {
    console.error("Error al crear reserva:", error);

    return res.status(500).json({
      error: "Error interno al crear la reserva"
    });
  }
};

// ========================================
// OBTENER UNA RESERVA POR ID
// GET /api/bookings/:bid
// ========================================

export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;

    const booking = await getBookingByIdService(bid);

    if (!booking) {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    return res.status(200).json(booking);

  } catch (error) {
    console.error("Error al consultar reserva:", error);

    return res.status(500).json({
      error: "Error interno al consultar la reserva"
    });
  }
};

// ========================================
// AGREGAR UN SERVICIO A UNA RESERVA
// POST /api/bookings/:bid/services/:sid
// ========================================

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;

    const result = await addServiceToBookingService(
      bid,
      sid,
      req.body.quantity
    );

    // Reserva inexistente
    if (result.error === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    // Servicio inexistente
    if (result.error === "SERVICE_NOT_FOUND") {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    // Cantidad inválida
    if (result.error === "INVALID_QUANTITY") {
      return res.status(400).json({
        error: "La cantidad debe ser un número entero mayor a 0"
      });
    }

    // Servicio agregado correctamente
    return res.status(200).json(result.booking);

  } catch (error) {
    console.error("Error al agregar servicio:", error);

    return res.status(500).json({
      error: "Error interno al agregar el servicio a la reserva"
    });
  }
};