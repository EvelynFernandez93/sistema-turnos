import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true
    },

    clientEmail: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      default: "pending"
    },

    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;