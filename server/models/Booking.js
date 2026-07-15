const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  eventDate: { type: String, required: [true, "Event date is required"] }, // "YYYY-MM-DD"
  startTime: { type: String, required: [true, "Start time is required"] }, // "HH:mm" 24hr
  endTime: { type: String, required: [true, "End time is required"] }, // "HH:mm" 24hr
  guestCount: { type: Number, required: [true, "Guest count is required"] },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
