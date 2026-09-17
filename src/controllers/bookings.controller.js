import {
  createBooking as createBookingService,
  getBookingById as getBookingByIdService,
  addServiceToBooking as addServiceToBookingService
} from "../services/bookings.service.js";

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const newBooking = await createBookingService(req.body);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// GET /api/bookings/:bid
export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;

    const booking = await getBookingByIdService(bid);

    if (!booking) {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// POST /api/bookings/:bid/services/:sid
export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;

    const result = await addServiceToBookingService(
      bid,
      sid
    );

    if (result.error === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    if (result.error === "SERVICE_NOT_FOUND") {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(result.booking);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};