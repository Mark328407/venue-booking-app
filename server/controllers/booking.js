const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const { errorHandler } = require("../auth");

// Converts "HH:mm" to minutes since midnight for easy range comparison
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const rangesOverlap = (startA, endA, startB, endB) => {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA);
};

module.exports.checkAvailability = (req, res) => {
  const { venueId, eventDate } = req.query;

  return Booking.find({
    venueId,
    eventDate,
    status: { $ne: "cancelled" },
  })
    .then((bookings) => {
      const bookedSlots = bookings.map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }));
      return res.status(200).send({ eventDate, bookedSlots });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.createBooking = (req, res) => {
  const userId = req.user.id;
  const { venueId, eventDate, startTime, endTime, guestCount } = req.body;

  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return res.status(400).send({ message: "Start time must be before end time" });
  }

  return Venue.findById(venueId)
    .then((venue) => {
      if (!venue) {
        return res.status(404).send({ message: "Venue not found" });
      }

      if (guestCount > venue.capacity) {
        return res.status(400).send({
          message: `Guest count exceeds venue capacity of ${venue.capacity}`,
        });
      }

      return Booking.find({ venueId, eventDate, status: { $ne: "cancelled" } }).then(
        (existingBookings) => {
          const hasConflict = existingBookings.some((b) =>
            rangesOverlap(startTime, endTime, b.startTime, b.endTime)
          );

          if (hasConflict) {
            return res.status(409).send({
              message: "This venue is already booked for part of the selected time range",
            });
          }

          const hours = (toMinutes(endTime) - toMinutes(startTime)) / 60;
          const totalPrice = Math.round(hours * venue.pricePerHour * 100) / 100;

          const newBooking = new Booking({
            userId,
            venueId,
            eventDate,
            startTime,
            endTime,
            guestCount,
            totalPrice,
          });

          return newBooking
            .save()
            .then((booking) =>
              res.status(201).send({ message: "Booking request submitted", booking })
            );
        }
      );
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getMyBookings = (req, res) => {
  return Booking.find({ userId: req.user.id })
    .populate("venueId", "name location image")
    .sort({ eventDate: 1 })
    .then((bookings) => res.status(200).send({ bookings }))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getAllBookings = (req, res) => {
  return Booking.find({})
    .populate("venueId", "name location")
    .populate("userId", "firstName lastName email")
    .sort({ eventDate: 1 })
    .then((bookings) => res.status(200).send({ bookings }))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.updateBookingStatus = (req, res) => {
  const { status } = req.body;

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).send({ message: "Invalid status value" });
  }

  return Booking.findByIdAndUpdate(req.params.bookingId, { status }, { new: true })
    .then((booking) => {
      if (!booking) {
        return res.status(404).send({ message: "Booking not found" });
      }
      return res.status(200).send({ message: "Booking status updated", booking });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.cancelMyBooking = (req, res) => {
  return Booking.findOne({ _id: req.params.bookingId, userId: req.user.id })
    .then((booking) => {
      if (!booking) {
        return res.status(404).send({ message: "Booking not found" });
      }

      booking.status = "cancelled";

      return booking
        .save()
        .then((updated) => res.status(200).send({ message: "Booking cancelled", booking: updated }));
    })
    .catch((error) => errorHandler(error, req, res));
};
