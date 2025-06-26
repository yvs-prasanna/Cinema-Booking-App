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

### 3. Setup Database
```bash
npm run setup
npm run seed
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
Query Parameters:
- city: City ID
- language: Filter by language (Hindi, English, etc.)
- genre: Filter by genre
- format: 2D, 3D, IMAX
**GET** `/api/movies?city=1&language=English&genre=Drama&format=3D`


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

### Get My Bookings  
**GET** `/api/bookings`

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

## 🍿 Food & Beverages

### Get All Items  
**GET** `/api/food`

### Get Item by ID  
**GET** `/api/food/:id`

### Add Item to Booking  
**POST** `/api/bookings/:bookingId/food`

#### Request Body:
```json
{
  "itemId": 3,
  "quantity": 2
}
```

### 🪑 Seat Layout

### Get Seat Layout for Screening
**GET**  `/api/screenings/:screeningId/seats`
Returns the seat map (available, booked, and reserved) for a given screening.

### Reserve Specific Seats
**POST**  `/api/screenings/:screeningId/reserve`

### Request Body:
```json
{
  "selectedSeats": ["B1", "B2"]
}
```
Seats are temporarily held until payment is confirmed.

### 💳 Payments
### Simulate Payment
**POST**  `/api/payments/checkout`

### Request Body:
```json
{
  "bookingId": 101,
  "amount": 350.00,
  "paymentMethod": "UPI"
}
```

Returns a mock payment confirmation.


### 🛠️ Admin APIs
These endpoints are for administrative purposes only.

### Add New Movie
**POST** `/api/admin/movies`

### Request Body:
```json
{
  "title": "Oppenheimer",
  "duration": 180,
  "genre": "Biography",
  "posterUrl": "https://example.com/poster.jpg"
}
```

### Schedule a Screening
**POST**  `/api/admin/screenings`

### Request Body:
```json
{
  "movieId": 1,
  "startTime": "2025-06-26T19:00:00",
  "screenNumber": 3
}
```

### Add Food Item
**POST**  `/api/admin/food`

### Request Body:
```json
{
  "name": "Cheese Popcorn",
  "price": 150,
  "category": "Snacks"
}
```

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

