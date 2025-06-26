# 🎬 Cinema Booking Platform API

This project provides a RESTful API backend for a cinema seat booking platform. It supports movie listings, screening schedules, seat selection, ticket booking, and user authentication.

---

## 🚀 Features

- 🔐 User Registration and Login
- 🎞️ Movie Listings with Screening Times
- 🪑 Real-time Seat Availability
- 🎟️ Ticket Booking and History
- 💳 Payment Simulation

---

## 🧰 Tech Stack

- Node.js
- Express.js
- SQLite (or your chosen DB)
- JWT for authentication
- Postman for API documentation

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cinema-booking-platform.git
cd cinema-booking-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Project
```bash
npm run setup
```

### 4. Run in Development
```bash
npm run dev
```

> Server will run at `http://localhost:3000`

---

## 🔐 Authentication

### Register  
**POST** `/api/auth/register`

#### Request Body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepassword"
}
```

---

### Login  
**POST** `/api/auth/login`

#### Request Body:
```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

---

## 🎞️ Movies

### Get All Movies  
**GET** `/api/movies`

### Get Movie by ID  
**GET** `/api/movies/:id`

---

## 📅 Screenings

### Get Screenings for a Movie  
**GET** `/api/screenings?movieId=1`

### Get Available Seats  
**GET** `/api/screenings/:screeningId/seats`

---

## 🎟️ Bookings

### Book Seats  
**POST** `/api/bookings`

#### Request Body:
```json
{
  "screeningId": 5,
  "selectedSeats": ["A1", "A2"],
  "paymentMethod": "card"
}
```

### Get My Bookings  
**GET** `/api/bookings`

> 🔐 Requires token:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Postman Collection

File: `Postman collection.json`

To import:
1. Open Postman
2. Click **"Import"**
3. Upload the collection file
4. Test all available routes

---

