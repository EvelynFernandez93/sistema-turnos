import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

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

export const getBookingById = async (id) => {
  return await bookingsRepository.getById(id);
};

export const addServiceToBooking = async (
  bookingId,
  serviceId
) => {
  const booking = await bookingsRepository.getById(bookingId);

  if (!booking) {
    return {
      error: "BOOKING_NOT_FOUND"
    };
  }

  const service = await servicesRepository.getById(serviceId);

  if (!service) {
    return {
      error: "SERVICE_NOT_FOUND"
    };
  }

  const existingService = booking.services.find(
    (item) => item.service === Number(serviceId)
  );

  if (existingService) {
    existingService.quantity += 1;
  } else {
    booking.services.push({
      service: Number(serviceId),
      quantity: 1
    });
  }

  const updatedBooking = await bookingsRepository.update(
    bookingId,
    booking
  );

  return {
    booking: updatedBooking
  };
};