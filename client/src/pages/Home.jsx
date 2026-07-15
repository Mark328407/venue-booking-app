import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import VenueCard from "../components/VenueCard";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  useEffect(() => {
    api
      .getActiveVenues()
      .then((data) => setVenues(data.venues || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const matchesSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase());
      const matchesCapacity = !minCapacity || v.capacity >= Number(minCapacity);
      return matchesSearch && matchesCapacity;
    });
  }, [venues, search, minCapacity]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow">Find your space</span>
          <h1>Book event venues by the hour, without the back-and-forth.</h1>
          <p>
            Browse real availability, pick your time slot, and send a booking request
            directly to the venue — no phone calls needed.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min. guest capacity"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            min="0"
          />
        </div>

        {loading ? (
          <p className="empty-state">Loading venues...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No venues match your search yet.</p>
        ) : (
          <div className="venue-grid">
            {filtered.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
