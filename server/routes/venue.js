const express = require("express");
const router = express.Router();

const venueController = require("../controllers/venue");
const { verify, verifyAdmin } = require("../auth");

router.post("/", verify, verifyAdmin, venueController.createVenue);
router.get("/all", verify, verifyAdmin, venueController.getAllVenues);
router.get("/active", venueController.getActiveVenues);
router.get("/:venueId", venueController.getVenue);
router.patch("/:venueId/update", verify, verifyAdmin, venueController.updateVenue);
router.patch("/:venueId/archive", verify, verifyAdmin, venueController.archiveVenue);
router.patch("/:venueId/activate", verify, verifyAdmin, venueController.activateVenue);

module.exports = router;
