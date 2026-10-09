import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

// Crear una nueva reserva
export const createBooking = async (bookingData) => {
  const requiredFields = [
    "clientName",
    "clientEmail",
    "date",
    "time",
    "status"
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      !Object.prototype.hasOwnProperty.call(bookingData, field)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Faltan campos obligatorios: ${missingFields.join(", ")}`
    );
  }

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

// Obtener una reserva por ID
export const getBookingById = async (id) => {
  return await bookingsRepository.getById(id);
};

// Agregar un servicio a una reserva
export const addServiceToBooking = async (
  bookingId,
  serviceId,
  quantity = 1
) => {

  // Buscar la reserva
  const booking = await bookingsRepository.getById(bookingId);

  if (!booking) {
    return { error: "BOOKING_NOT_FOUND" };
  }

  // Buscar el servicio
  const service = await servicesRepository.getById(serviceId);

  if (!service) {
    return { error: "SERVICE_NOT_FOUND" };
  }

  // Verificar si el servicio ya existe en la reserva
  const existingService = booking.services.find(
    (item) =>
      item.service._id.toString() === serviceId.toString()
  );

  if (existingService) {

    // Incrementar la cantidad existente
    existingService.quantity += quantity;

  } else {

    // Agregar referencia al servicio
    booking.services.push({
      service: serviceId,
      quantity
    });

  }

  // Guardar los cambios
  const updatedBooking = await bookingsRepository.update(
    bookingId,
    {
      services: booking.services.map((item) => ({
        service: item.service._id ?? item.service,
        quantity: item.quantity
      }))
    }
  );

  return { booking: updatedBooking };
};