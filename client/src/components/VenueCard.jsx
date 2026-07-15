import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  return (
    <Link to={`/venues/${venue._id}`} className="venue-card">
      <img
        src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=60"}
        alt={venue.name}
      />
      <div className="venue-card-body">
        <h3>{venue.name}</h3>
        <p className="venue-card-location">{venue.location}</p>
        <div className="venue-card-footer">
          <span className="venue-card-price">₱{venue.pricePerHour}/hr</span>
          <span className="venue-card-capacity">Up to {venue.capacity} guests</span>
        </div>
      </div>
    </Link>
  );
}
