import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

// ========================================
// CREAR UNA NUEVA RESERVA
// ========================================

export const createBooking = async (bookingData) => {
  const requiredFields = [
    "clientName",
    "clientEmail",
    "date",
    "time",
    "status"
  ];

  // Verificar campos obligatorios
  const missingFields = requiredFields.filter(
    (field) =>
      !Object.prototype.hasOwnProperty.call(bookingData, field)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Faltan campos obligatorios: ${missingFields.join(", ")}`
    );
  }

  // Crear la reserva sin servicios asociados
  const newBooking = {
    clientName: bookingData.clientName,
    clientEmail: bookingData.clientEmail,
    date: bookingData.date,
    time: bookingData.time,
    status: bookingData.status,
    services: []
  };

  return await bookingsRepository.create(newBooking);
};

// ========================================
// OBTENER UNA RESERVA POR ID
// ========================================

export const getBookingById = async (id) => {
  return await bookingsRepository.getById(id);
};

// ========================================
// AGREGAR UN SERVICIO A UNA RESERVA
// ========================================

export const addServiceToBooking = async (
  bookingId,
  serviceId,
  quantity = 1
) => {

  // 1. Validar que la cantidad sea un entero positivo
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { error: "INVALID_QUANTITY" };
  }

  // 2. Buscar la reserva
  const booking = await bookingsRepository.getById(bookingId);

  if (!booking) {
    return { error: "BOOKING_NOT_FOUND" };
  }

  // 3. Buscar el servicio
  const service = await servicesRepository.getById(serviceId);

  if (!service) {
    return { error: "SERVICE_NOT_FOUND" };
  }

  // 4. Preparar las referencias de servicios
  // Conservamos los ObjectId y las cantidades,
  // sin guardar los documentos completos.

  const bookingServices = booking.services.map((item) => {

    // Si populate no encontró el documento relacionado,
    // no eliminamos silenciosamente la asociación.
    if (item.service === null || item.service === undefined) {
      throw new Error(
        "La reserva contiene una referencia a un servicio inexistente"
      );
    }

    return {
      service: item.service._id ?? item.service,
      quantity: item.quantity
    };
  });

  // 5. Comprobar si el servicio ya existe en la reserva
  const existingService = bookingServices.find(
    (item) =>
      item.service.toString() === serviceId.toString()
  );

  // 6. Actualizar la cantidad o agregar el servicio
  if (existingService) {

    existingService.quantity += quantity;

  } else {

    bookingServices.push({
      service: service._id,
      quantity
    });

  }

  // 7. Guardar los cambios en MongoDB
  const updatedBooking = await bookingsRepository.update(
    bookingId,
    {
      services: bookingServices
    }
  );

  // 8. Devolver la reserva actualizada
  return { booking: updatedBooking };
};