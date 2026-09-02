import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "../data/bookings.json"
);

class BookingManager {
  constructor() {
    this.path = bookingsPath;
  }

  async getBookings() {
    const data = await fs.readFile(this.path, "utf-8");

    return JSON.parse(data);
  }

  async createBooking(bookingData) {
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

    const bookings = await this.getBookings();

    const newId =
      bookings.length === 0
        ? 1
        : Math.max(...bookings.map((booking) => booking.id)) + 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: []
    };

    bookings.push(newBooking);

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2)
    );

    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this.getBookings();

    const booking = bookings.find(
      (booking) => booking.id === Number(id)
    );

    return booking || null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.getBookings();

    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === Number(bookingId)
    );

    if (bookingIndex === -1) {
      return null;
    }

    const existingService = bookings[
      bookingIndex
    ].services.find(
      (item) => item.service === Number(serviceId)
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      bookings[bookingIndex].services.push({
        service: Number(serviceId),
        quantity: 1
      });
    }

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2)
    );

    return bookings[bookingIndex];
  }
}

export default BookingManager;