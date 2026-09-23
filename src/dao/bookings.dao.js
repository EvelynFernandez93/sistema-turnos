import Booking from "../models/booking.model.js";

class BookingsDAO {

  async getAll() {
    return await Booking.find()
      .populate("services.service");
  }

  async getById(id) {
    return await Booking.findById(id)
      .populate("services.service");
  }

  async create(bookingData) {
    return await Booking.create(bookingData);
  }

  async update(id, updatedData) {
    return await Booking.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    ).populate("services.service");
  }
}

export default BookingsDAO;