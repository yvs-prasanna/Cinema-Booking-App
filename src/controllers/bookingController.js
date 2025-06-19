const express = require("express")
const db = require("../config/database") 

const app = express()
app.use(express.json())


const areSeatsAlreadyBooked = async(db, showId, seats) =>  {
  const placeholders = seats.map(() => '?').join(', ');
  const query = `
    SELECT bs.seat_identifier
    FROM booked_seats bs
    JOIN bookings b ON bs.booking_id = b.id
    WHERE b.show_id = ?
    AND bs.seat_identifier IN (${placeholders})
  `;
  const params = [showId, ...seats];
  return await db.query(query, params); // Array of { seat_identifier }
}


const createBookingAPI = async (req, res) => {
    const { showId, seats, totalAmount, userDetails } = req.body;

    if (!showId || !seats || !totalAmount || !userDetails) {
        return res.status(400).json({ error: "Need values of all fields, Especially booking reference, Give some random number to it" });
    }

    const {email} = userDetails;
        const dbUserQuery = `select * from users where email = ?`;
        const dbUser = await db.get(dbUserQuery, [email]);

        if (!dbUser) {
            return res.status(404).json({ error: "User not found" });
        }
    
    const alreadyBooked = await areSeatsAlreadyBooked(db, showId, seats);

    if (alreadyBooked.length > 0) {
            const bookedSeats = alreadyBooked.map(row => row.seat_identifier);
            return res.status(409).json({
                error: 'Some seats are already booked',
                bookedSeats: bookedSeats
            });
        }
        
        const samplequery = `
        SELECT sl.id AS seat_id, sl.row_name, sl.seat_number, sl.seat_category
        FROM shows s
        JOIN screens sc ON s.screen_id = sc.id
        JOIN seat_layout sl ON sl.screen_id = sc.id
        WHERE s.id = ?
            AND sl.is_active = 1
        `;

        const allSeats = await db.query(samplequery, [showId]);

        const getSeatId = (identifier) => {
        const row = identifier[0]; 
        const number = parseInt(identifier.slice(1)); 
        const seat = allSeats.find(
            (s) => s.row_name === row && s.seat_number === number
        );
        return seat ? seat.seat_id : null; 
        };

        const seatIds = seats.map(getSeatId);

    //Get show Details
    const showQuery = `SELECT movies.title as movie, theaters.name as theater, screen_name as screen, show_time as showTime, show_date as date
     FROM ((shows inner join movies on shows.movie_id = movies.id) as T inner join screens
     on T.screen_id = screens.id) as Q inner join theaters on Q.theater_id = theaters.id WHERE shows.id = ?`;
    let show = await db.get(showQuery, [showId]);
    const showDateTimeString = `${show.date} ${show.showTime}`; // e.g., '2025-06-21 1:30 PM'
        const showDateTime = new Date(showDateTimeString);

        // Get current datetime
        const currentDateTime = new Date();

        // Compare
        if (currentDateTime > showDateTime) {
        return res.status(400).json({ error: "Show time has already passed" });
        }

    show = {...show,
        seats: seats
    };
    const generateBookingReference = () => {
        const timestamp = Date.now().toString().slice(-6);  // Last 6 digits of timestamp
        const random = Math.floor(1000 + Math.random() * 900); // 4-digit random number
        return `PVR${timestamp}${random}`;
    };
    const bookingReference = generateBookingReference();

    try {
        const bookingQuery = `INSERT INTO bookings (booking_reference, user_id, show_id, total_seats, total_amount, user_email, booking_status, payment_status, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await db.run(bookingQuery, [bookingReference, dbUser.id, showId, seats.length, totalAmount, email, 'confirmed', 'completed', new Date().toISOString().split('T')[0]]);
        const response = {
            success: true,
            message: "Booking created successfully",
            bookingId: bookingReference,
            totalAmount: totalAmount,
            showDetails: show,
        }
        const lastId = result.id;
        for(let i=0; i<seats.length; i++){
            const seatQuery = `INSERT INTO booked_seats (booking_id, seat_id, seat_identifier) VALUES (?, ?, ?)`;
            await db.run(seatQuery, [lastId, seatIds[i], seats[i]]);
        }
        return res.status(201).json(response);
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getUsersBookingsAPI = async(req, res) => {
    const email = req.email;
    const dbUserQuery = `SELECT * FROM users WHERE email = ?`;
    const dbUser = await db.get(dbUserQuery, [email]);

    if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
    }

    const dbBookingsQuery = `SELECT * FROM bookings WHERE user_id = ?`;
    const bookings = await db.query(dbBookingsQuery, [dbUser.id]);

    const response = {
        success: true,
        bookings: bookings
    };
    return res.status(200).json(response);
}

const getBookingByIdAPI = async(req, res) => {
    const {bookingId} = req.params;
    const dbBookingQuery = `SELECT * FROM bookings WHERE id = ?`;
    const booking = await db.get(dbBookingQuery, [bookingId]);

    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    const response = {
        success: true,
        booking: booking
    };
    return res.status(200).json(response);
}

const getBookedSeats = async(req, res) => {
    const query = `select * from bookings`
    const result = await db.query(query);
    return res.status(200).json(result);
}

module.exports = {
    createBookingAPI,
    getUsersBookingsAPI,
    getBookingByIdAPI,
    getBookedSeats   
};

