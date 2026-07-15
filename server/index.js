const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const venueRoutes = require("./routes/venue");
const bookingRoutes = require("./routes/booking");

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL || "",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/venues", venueRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Venue Booking API is running");
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API is now online on port ${port}`));
}

module.exports = { app, mongoose };
