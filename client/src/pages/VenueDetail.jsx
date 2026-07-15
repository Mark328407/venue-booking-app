import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import AvailabilityStrip from "../components/AvailabilityStrip";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function VenueDetail() {
  const { venueId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventDate, setEventDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [guestCount, setGuestCount] = useState(1);

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .getVenue(venueId)
      .then((data) => setVenue(data.venue))
      .finally(() => setLoading(false));
  }, [venueId]);

  useEffect(() => {
    if (!eventDate) return;
    api
      .getAvailability(venueId, eventDate)
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]));
  }, [venueId, eventDate]);

  if (loading) return <div className="container">Loading venue...</div>;
  if (!venue) return <div className="container">Venue not found.</div>;

  const hours = Math.max(
    0,
    (Number(endTime.split(":")[0]) + Number(endTime.split(":")[1]) / 60) -
      (Number(startTime.split(":")[0]) + Number(startTime.split(":")[1]) / 60)
  );
  const estimatedTotal = Math.round(hours * venue.pricePerHour * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      await api.createBooking(
        { venueId, eventDate, startTime, endTime, guestCount: Number(guestCount) },
        token
      );
      setStatus("success");
      setMessage("Booking request submitted! Check My Bookings for status updates.");
      const data = await api.getAvailability(venueId, eventDate);
      setBookedSlots(data.bookedSlots || []);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="container venue-detail">
      <div>
        <img
          src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=70"}
          alt={venue.name}
        />
        <h1>{venue.name}</h1>
        <p className="venue-detail-location">{venue.location}</p>
        <p className="venue-detail-description">{venue.description}</p>

        {venue.amenities?.length > 0 && (
          <div className="amenity-list">
            {venue.amenities.map((a) => (
              <span key={a} className="amenity-chip">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="venue-meta">
          <span>CAPACITY {venue.capacity}</span>
          <span>₱{venue.pricePerHour}/HR</span>
        </div>
      </div>

      <div className="booking-panel">
        <h2>Request this venue</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="eventDate">Date</label>
            <input
              id="eventDate"
              type="date"
              min={todayISO()}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <AvailabilityStrip
            bookedSlots={bookedSlots}
            selectedStart={startTime}
            selectedEnd={endTime}
          />

          <div className="field-row">
            <div className="field">
              <label htmlFor="startTime">Start</label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="endTime">End</label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="guestCount">Guests</label>
            <input
              id="guestCount"
              type="number"
              min="1"
              max={venue.capacity}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              required
            />
          </div>

          <div className="total-price">
            <span>Estimated total</span>
            <span>₱{estimatedTotal || 0}</span>
          </div>

          <button className="btn-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Submitting..."
              : user
              ? "Request booking"
              : "Log in to book"}
          </button>

          {message && (
            <p className={`form-message ${status === "success" ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
