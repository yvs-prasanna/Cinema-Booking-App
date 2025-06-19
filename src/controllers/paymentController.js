const express = require('express');
const db = require("../config/database");

const app = express();
app.use(express.json());


const initializePayment = async (req, res) => {
    const { bookingId, paymentMethod, includesFnb } = req.body; 
    if (!bookingId || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Booking ID and payment method are required"
        });
    }
    try {
       
        const bookingQuery = `SELECT * FROM bookings WHERE booking_reference = ?`;
        const bookingDetails = await db.query(bookingQuery, [bookingId]);
        
        if (bookingDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const booking = bookingDetails[0];
        let totalAmount = booking.total_amount;
        let fnbAmount = 0;

        
        if (includesFnb) {
            const fnbQuery = `SELECT sum(total_amount) as totalFNB FROM food_orders WHERE booking_id = ?`;
            const fnbDetails = await db.query(fnbQuery, [booking.id]);
            fnbAmount = fnbDetails[0].totalFNB || 0;
            totalAmount += fnbAmount;
        }

        
        const convenienceFee = 50; // Example fixed fee
        const gst = (totalAmount + convenienceFee) * 0.18; // 18% GST
        totalAmount += convenienceFee + gst;

        
        const transactionId = `TXN${Math.floor(Math.random() * 1000000)}`;

        res.status(200).json({
            success: true,
            transactionId,
            amount: totalAmount,
            breakdown: {
                tickets: booking.total_amount,
                fnb: fnbAmount,
                convenienceFee,
                gst,
                total: totalAmount
            }
        });
    } catch (error) {
        console.error("Error initializing payment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize payment"
        });
    }
};

module.exports = {
    initializePayment
};