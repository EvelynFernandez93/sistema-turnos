import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "../data/bookings.json"
);

class BookingsDAO {
  constructor() {
    this.path = bookingsPath;
  }

  async getAll() {
    const data = await fs.readFile(this.path, "utf-8");

    return JSON.parse(data);
  }

  async getById(id) {
    const bookings = await this.getAll();

    const booking = bookings.find(
      (booking) => booking.id === Number(id)
    );

    return booking || null;
  }

  async create(bookingData) {
    const bookings = await this.getAll();

    const newId =
      bookings.length === 0
        ? 1
        : Math.max(...bookings.map((booking) => booking.id)) + 1;

    const newBooking = {
      id: newId,
      ...bookingData
    };

    bookings.push(newBooking);

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2)
    );

    return newBooking;
  }

  async update(id, updatedData) {
    const bookings = await this.getAll();

    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === Number(id)
    );

    if (bookingIndex === -1) {
      return null;
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updatedData,
      id: bookings[bookingIndex].id
    };

    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2)
    );

    return bookings[bookingIndex];
  }
}

export default BookingsDAO;
