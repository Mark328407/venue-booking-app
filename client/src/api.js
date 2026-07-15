const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || data.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) => request("/users/register", { method: "POST", body: payload }),
  login: (payload) => request("/users/login", { method: "POST", body: payload }),
  getMe: (token) => request("/users/details", { token }),

  getActiveVenues: () => request("/venues/active"),
  getVenue: (id) => request(`/venues/${id}`),

  getAvailability: (venueId, eventDate) =>
    request(`/bookings/availability?venueId=${venueId}&eventDate=${eventDate}`),
  createBooking: (payload, token) =>
    request("/bookings", { method: "POST", body: payload, token }),
  getMyBookings: (token) => request("/bookings/my-bookings", { token }),
  cancelBooking: (id, token) =>
    request(`/bookings/${id}/cancel`, { method: "PATCH", token }),
};
