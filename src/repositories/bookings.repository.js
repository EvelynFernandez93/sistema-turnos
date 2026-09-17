import BookingsDAO from "../dao/bookings.dao.js";

class BookingsRepository {
  constructor() {
    this.dao = new BookingsDAO();
  }

  async create(bookingData) {
    return await this.dao.create(bookingData);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async update(id, updatedData) {
    return await this.dao.update(id, updatedData);
  }
}

export default BookingsRepository;