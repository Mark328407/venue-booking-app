# Venue Booking App

A full-stack MERN application for browsing event venues and booking them by the hour. Users can search venues, see real-time hourly availability, submit booking requests, and manage their own bookings — with conflict checking so no venue can be double-booked for overlapping time slots.

## Features

- **Auth** — JWT-based registration and login with bcrypt password hashing
- **Venue catalog** — browse and search venues by name, location, and minimum capacity
- **Hourly availability** — a visual availability strip on each venue page shows which hours are already booked for the selected date
- **Booking with conflict detection** — the API rejects any booking that overlaps an existing confirmed/pending booking for the same venue and date
- **Guest capacity validation** — bookings are rejected if guest count exceeds venue capacity
- **My Bookings** — view booking history and cancel upcoming requests
- **Admin-ready backend** — venue CRUD, booking status management, and full booking visibility are already scaffolded behind an `isAdmin` flag

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens, bcrypt

## Project Structure

```
venue-booking-app/
├── server/     # Express + MongoDB REST API
└── client/     # React (Vite) frontend
```

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_STRING and JWT_SECRET_KEY
npm run dev
```

Optional — seed the database with sample venues:

```bash
node seed.js
```

The API runs on `http://localhost:4000` by default.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL if different from the default
npm run dev
```

The app runs on `http://localhost:5173` by default.

## API Overview

### Users — `/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Log in and receive a JWT |
| GET | `/details` | Authenticated | Get the logged-in user's profile |

### Venues — `/venues`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/active` | Public | List all active venues |
| GET | `/:venueId` | Public | Get a single venue |
| POST | `/` | Admin | Create a venue |
| GET | `/all` | Admin | List all venues |
| PATCH | `/:venueId/update` | Admin | Update venue details |
| PATCH | `/:venueId/archive` | Admin | Deactivate a venue |
| PATCH | `/:venueId/activate` | Admin | Reactivate a venue |

### Bookings — `/bookings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/availability?venueId=&eventDate=` | Public | Get booked time slots for a venue/date |
| POST | `/` | Authenticated | Submit a booking request (checked for time conflicts and capacity) |
| GET | `/my-bookings` | Authenticated | Get the logged-in user's bookings |
| PATCH | `/:bookingId/cancel` | Authenticated | Cancel one of your own bookings |
| GET | `/all` | Admin | View every booking |
| PATCH | `/:bookingId/status` | Admin | Confirm, reject, or update a booking's status |

> Protected routes require an `Authorization: Bearer <token>` header, using the token from `/users/login`.

## Design Notes

The interface leans into the "venue/event" subject matter: a deep teal and warm brass palette instead of a generic dark theme, paired with a serif display face (Fraunces) for warmth and an availability strip that encodes real booking data rather than acting as decoration.

## Author

**Mark Anthony Estrecho** — [GitHub](https://github.com/Mark328407)
# venue-booking-app
