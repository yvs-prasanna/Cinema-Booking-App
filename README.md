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
## API Endpoints

### 1. Authentication APIs

#### POST /api/auth/register
Register a new user
```json
Request Body:
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "mobile": "+919876543210",
    "dateOfBirth": "1990-01-01"
}

Response:
{
    "success": true,
    "message": "User registered successfully",
    "userId": 1
}
```

#### POST /api/auth/login
User login
```json
Request Body:
{
    "email": "john@example.com",
    "password": "securePassword123"
}

Response:
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### 2. Location APIs

#### GET /api/cities
Get cities with theaters
```json
Response:
{
    "success": true,
    "cities": [
        {
            "id": 1,
            "name": "Mumbai",
            "state": "Maharashtra",
            "theaterCount": 15
        },
        {
            "id": 2,
            "name": "Delhi",
            "state": "Delhi",
            "theaterCount": 12
        }
    ]
}
```

### 3. Movie APIs

#### GET /api/movies
Get currently running movies
```
Query Parameters:
- city: City ID
- language: Filter by language (Hindi, English, etc.)
- genre: Filter by genre
- format: 2D, 3D, IMAX

Response:
{
    "success": true,
    "movies": [
        {
            "id": 1,
            "title": "Avengers: Endgame",
            "duration": "180 mins",
            "rating": "UA",
            "genre": ["Action", "Adventure", "Sci-Fi"],
            "language": ["English", "Hindi"],
            "formats": ["2D", "3D", "IMAX"],
            "posterUrl": "poster_url",
            "releaseDate": "2024-04-26",
            "imdbRating": 8.4
        }
    ]
}
```

#### GET /api/movies/:id
Get movie details
```json
Response:
{
    "success": true,
    "movie": {
        "id": 1,
        "title": "Avengers: Endgame",
        "synopsis": "The Avengers assemble once more...",
        "duration": "180 mins",
        "rating": "UA",
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "language": ["English", "Hindi"],
        "formats": ["2D", "3D", "IMAX"],
        "cast": [
            {
                "name": "Robert Downey Jr.",
                "role": "Tony Stark / Iron Man"
            }
        ],
        "crew": {
            "director": "Anthony Russo, Joe Russo",
            "producer": "Kevin Feige"
        },
        "posterUrl": "poster_url",
        "trailerUrl": "trailer_url"
    }
}
```

#### GET /api/movies/upcoming
Get upcoming movies

### 4. Theater APIs

#### GET /api/theaters
Get theaters by city
```
Query Parameters:
- cityId: City ID (required)
- movieId: Filter theaters showing specific movie

Response:
{
    "success": true,
    "theaters": [
        {
            "id": 1,
            "name": "PVR Phoenix Mall",
            "address": "Phoenix MarketCity, Kurla West, Mumbai",
            "facilities": ["Parking", "Food Court", "Wheelchair Accessible"],
            "screens": 8,
            "latitude": 19.0860,
            "longitude": 72.8886
        }
    ]
}
```

### 5. Show APIs

#### GET /api/shows
Get shows for a movie
```
Query Parameters:
- movieId: Movie ID (required)
- cityId: City ID (required)
- date: Show date (YYYY-MM-DD)

Response:
{
    "success": true,
    "date": "2024-03-20",
    "shows": [
        {
            "theaterId": 1,
            "theaterName": "PVR Phoenix Mall",
            "shows": [
                {
                    "showId": 101,
                    "showTime": "10:30 AM",
                    "format": "2D",
                    "language": "English",
                    "screenName": "Screen 1",
                    "soundSystem": "Dolby Atmos",
                    "availableSeats": 120,
                    "totalSeats": 200,
                    "prices": {
                        "regular": 200,
                        "premium": 300,
                        "recliner": 500
                    }
                }
            ]
        }
    ]
}
```

### 6. Seat APIs

#### GET /api/shows/:showId/seats
Get seat layout and availability
```json
Response:
{
    "success": true,
    "screen": "Screen 1",
    "seatLayout": {
        "regular": {
            "rows": ["A", "B", "C", "D", "E"],
            "seatsPerRow": 20,
            "price": 200
        },
        "premium": {
            "rows": ["F", "G", "H"],
            "seatsPerRow": 20,
            "price": 300
        },
        "recliner": {
            "rows": ["I", "J"],
            "seatsPerRow": 15,
            "price": 500
        }
    },
    "bookedSeats": ["A5", "A6", "B10", "B11", "F8", "F9"],
    "blockedSeats": ["C15", "C16"]
}
```

### 7. Booking APIs

#### POST /api/bookings/create
Create a booking (requires authentication)
```json
Request Body:
{
    "showId": 101,
    "seats": ["F10", "F11"],
    "totalAmount": 600,
    "userDetails": {
        "email": "john@example.com",
        "mobile": "+919876543210"
    }
}

Response:
{
    "success": true,
    "bookingId": "PVR123456",
    "message": "Booking confirmed",
    "totalAmount": 600,
    "showDetails": {
        "movie": "Avengers: Endgame",
        "theater": "PVR Phoenix Mall",
        "screen": "Screen 1",
        "showTime": "10:30 AM",
        "date": "2024-03-20",
        "seats": ["F10", "F11"]
    }
}
```

#### GET /api/bookings
Get user's booking history (requires authentication)

#### GET /api/bookings/:bookingId
Get booking details

#### POST /api/bookings/:bookingId/cancel
Cancel booking (requires authentication)

### 8. Food & Beverage APIs

#### GET /api/fnb/menu
Get F&B menu
```json
Response:
{
    "success": true,
    "categories": [
        {
            "name": "Popcorn",
            "items": [
                {
                    "id": 1,
                    "name": "Regular Salted Popcorn",
                    "size": "Medium",
                    "price": 200,
                    "isVeg": true
                },
                {
                    "id": 2,
                    "name": "Cheese Popcorn",
                    "size": "Large",
                    "price": 350,
                    "isVeg": true
                }
            ]
        },
        {
            "name": "Beverages",
            "items": [...]
        }
    ]
}
```

#### POST /api/fnb/order
Add F&B to booking
```json
Request Body:
{
    "bookingId": "PVR123456",
    "items": [
        {
            "itemId": 1,
            "quantity": 2
        },
        {
            "itemId": 5,
            "quantity": 2
        }
    ]
}
```

### 9. Payment APIs

#### POST /api/payments/initiate
Initiate payment for booking
```json
Request Body:
{
    "bookingId": "PVR123456",
    "paymentMethod": "card",
    "includesFnb": true
}

Response:
{
    "success": true,
    "transactionId": "TXN789456",
    "amount": 1000,
    "breakdown": {
        "tickets": 600,
        "fnb": 400,
        "convenienceFee": 50,
        "gst": 90,
        "total": 1140
    }
}
```

#### POST /api/payments/confirm
Confirm payment

### 10. Admin APIs (Bonus)

#### POST /api/admin/movies
Add new movie

### Request Body
```json
{
  "title": "Inception",
  "synopsis": "A skilled thief is given a chance at redemption if he can successfully perform inception – planting an idea into someone's subconscious.",
  "duration": 148,
  "rating": "UA",
  "language": ["English", "Hindi"],
  "formats": ["2D", "IMAX"],
  "cast": [
    "Leonardo DiCaprio",
    "Joseph Gordon-Levitt",
    "Elliot Page"
  ],
  "crew": [
    "Christopher Nolan",
    "Emma Thomas"
  ],
  "releaseDate": "2024-07-16",
  "genre": ["Action", "Sci-Fi", "Thriller"],
  "theaterId": 1
}

```

#### POST /api/admin/shows
Create show schedule

#### PUT /api/admin/shows/:id
Update show details

#### GET /api/admin/reports/occupancy
Get theater occupancy reports

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

