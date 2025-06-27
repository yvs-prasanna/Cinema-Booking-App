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

         // Create payment record
        await db.run(`
      INSERT INTO payments (transaction_id, booking_id, amount, payment_method, payment_status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [transactionId, booking.bookingId, totalAmount, paymentMethod]);

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

const confirmPayment = async (req, res, next) => {
  try {
    const { transactionId, gatewayResponse } = req.body;
    const userId = req.userId;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }
    
    // Get payment details
    const payment = await db.get(`
      SELECT p.*, b.booking_reference, b.user_id
      FROM payments p
      INNER JOIN bookings b ON p.booking_id = b.id
      WHERE p.transaction_id = ? AND b.user_id = ?
    `, [transactionId, userId]);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.payment_status === 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment already confirmed'
      });
    }
    
    // In a real implementation, you would verify the payment with the payment gateway
    // For this demo, we'll simulate a successful payment
    const paymentSuccess = !gatewayResponse || gatewayResponse.status === 'success';
    
    const paymentStatus = paymentSuccess ? 'success' : 'failed';
    
    // Update payment status
    await db.run(`
      UPDATE payments 
      SET payment_status = ?, gateway_response = ?, processed_at = datetime('now')
      WHERE transaction_id = ?
    `, [paymentStatus, JSON.stringify(gatewayResponse || {}), transactionId]);
    
    // Update booking payment status
    await db.run(`
      UPDATE bookings 
      SET payment_status = ?
      WHERE id = ?
    `, [paymentStatus === 'success' ? 'completed' : 'failed', payment.booking_id]);
    
    if (paymentSuccess) {
      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        transactionId,
        bookingId: payment.booking_reference,
        amount: payment.amount
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        transactionId
      });
    }
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializePayment,
  confirmPayment
};

