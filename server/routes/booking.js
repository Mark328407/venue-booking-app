const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");
const { verify, verifyAdmin } = require("../auth");

router.get("/availability", bookingController.checkAvailability);
router.post("/", verify, bookingController.createBooking);
router.get("/my-bookings", verify, bookingController.getMyBookings);
router.get("/all", verify, verifyAdmin, bookingController.getAllBookings);
router.patch("/:bookingId/status", verify, verifyAdmin, bookingController.updateBookingStatus);
router.patch("/:bookingId/cancel", verify, bookingController.cancelMyBooking);

module.exports = router;
