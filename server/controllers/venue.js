const Venue = require("../models/Venue");
const { errorHandler } = require("../auth");

module.exports.createVenue = (req, res) => {
  const { name, description, location, capacity, pricePerHour, amenities, image } = req.body;

  const newVenue = new Venue({
    name,
    description,
    location,
    capacity,
    pricePerHour,
    amenities: amenities || [],
    image: image || "",
  });

  return newVenue
    .save()
    .then((venue) => res.status(201).send({ message: "Venue created successfully", venue }))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getAllVenues = (req, res) => {
  return Venue.find({})
    .then((venues) => res.status(200).send({ venues }))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getActiveVenues = (req, res) => {
  return Venue.find({ isActive: true })
    .then((venues) => res.status(200).send({ venues }))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getVenue = (req, res) => {
  return Venue.findById(req.params.venueId)
    .then((venue) => {
      if (!venue) {
        return res.status(404).send({ message: "Venue not found" });
      }
      return res.status(200).send({ venue });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.updateVenue = (req, res) => {
  const { name, description, location, capacity, pricePerHour, amenities, image } = req.body;

  return Venue.findByIdAndUpdate(
    req.params.venueId,
    { name, description, location, capacity, pricePerHour, amenities, image },
    { new: true }
  )
    .then((venue) => {
      if (!venue) {
        return res.status(404).send({ message: "Venue not found" });
      }
      return res.status(200).send({ message: "Venue updated successfully", venue });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.archiveVenue = (req, res) => {
  return Venue.findByIdAndUpdate(req.params.venueId, { isActive: false }, { new: true })
    .then((venue) => {
      if (!venue) {
        return res.status(404).send({ message: "Venue not found" });
      }
      return res.status(200).send({ message: "Venue archived successfully", venue });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.activateVenue = (req, res) => {
  return Venue.findByIdAndUpdate(req.params.venueId, { isActive: true }, { new: true })
    .then((venue) => {
      if (!venue) {
        return res.status(404).send({ message: "Venue not found" });
      }
      return res.status(200).send({ message: "Venue activated successfully", venue });
    })
    .catch((error) => errorHandler(error, req, res));
};
