import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    setLoading(true);
    api
      .getMyBookings(token)
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCancel = async (id) => {
    await api.cancelBooking(id, token);
    loadBookings();
  };

  return (
    <div className="container bookings-page">
      <h1>My Bookings</h1>

      {loading ? (
        <p className="empty-state">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="empty-state">You haven't requested any venues yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="booking-row">
            <div className="booking-row-main">
              <h3>{b.venueId?.name || "Venue"}</h3>
              <p>
                {b.eventDate} · {b.startTime}–{b.endTime} · {b.guestCount} guests · ₱
                {b.totalPrice}
              </p>
            </div>
            <span className={`status-pill ${b.status}`}>{b.status}</span>
            {b.status !== "cancelled" && (
              <button className="btn-text" onClick={() => handleCancel(b._id)}>
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
