// Run with: node seed.js
// Populates the database with sample venues so the app has data to demo immediately.
const mongoose = require("mongoose");
require("dotenv").config();
const Venue = require("./models/Venue");

const sampleVenues = [
  {
    name: "The Glasshouse Pavilion",
    description:
      "A light-filled event space with floor-to-ceiling windows, ideal for weddings and corporate launches.",
    location: "Makati City, Metro Manila",
    capacity: 150,
    pricePerHour: 3500,
    amenities: ["Wi-Fi", "Sound system", "Catering kitchen", "Parking"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=70",
  },
  {
    name: "Riverside Function Hall",
    description:
      "A riverside venue with an open-air terrace, popular for birthdays and reunions.",
    location: "Bacoor, Cavite",
    capacity: 80,
    pricePerHour: 1800,
    amenities: ["Outdoor terrace", "Wi-Fi", "Tables & chairs"],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=70",
  },
  {
    name: "Blackbox Studio",
    description: "A minimalist studio space suited for photoshoots, workshops, and pop-ups.",
    location: "Quezon City, Metro Manila",
    capacity: 40,
    pricePerHour: 1200,
    amenities: ["Lighting rig", "Wi-Fi", "Changing room"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=70",
  },
  {
    name: "Skyline Rooftop Lounge",
    description: "A rooftop venue with city views, great for cocktail parties and mixers.",
    location: "Taguig City, Metro Manila",
    capacity: 100,
    pricePerHour: 4200,
    amenities: ["Bar setup", "City view", "Sound system"],
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=70",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_STRING);
  console.log("Connected to MongoDB");

  await Venue.deleteMany({});
  await Venue.insertMany(sampleVenues);

  console.log(`Seeded ${sampleVenues.length} venues`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
