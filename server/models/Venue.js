const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Venue name is required"] },
  description: { type: String, required: [true, "Description is required"] },
  location: { type: String, required: [true, "Location is required"] },
  capacity: { type: Number, required: [true, "Capacity is required"] },
  pricePerHour: { type: Number, required: [true, "Price per hour is required"] },
  amenities: { type: [String], default: [] },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Venue", venueSchema);
