const express = require('express');
const db = require("../config/database");

const app = express();
app.use(express.json());

const getFnbMenu = async(req, res) => {
    const menuQuery = `select * from fnb_items `;
    try {
        const rows = await db.query(menuQuery);
        const categorizedObject = {};
        rows.forEach(items => {
            if(!categorizedObject[items.category]) {
                categorizedObject[items.category] = [];
            }
            categorizedObject[items.category].push({
                id: items.id,
                name: items.name,
                price: items.price,
                description: items.description,
                image: items.image,
                isVeg: items.is_veg ? true : false
            });
        })
        res.status(200).json({
            status: "success",
            data: categorizedObject
        });
    } catch (error) {
        console.error("Error fetching F&B menu:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch F&B menu"
        });
    }
}

//Create an Fnb order
const addFnbOrder = async(req, res) => {
    let {bookingId, items} = req.body;
    if(!bookingId || !items || items.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Booking ID and items are required"
        });
    }
    const bookingReference = bookingId;
    const getBookingIdQuery = `SELECT * FROM bookings WHERE booking_reference = ?`;
    const bookingDetails = await db.query(getBookingIdQuery, [bookingReference]);
    if(bookingDetails.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "Booking Reference not found"
        });
    }
    bookingId = bookingDetails[0].id;
    let total_price = 0;
    for(const item of items) {
        if(!item.itemId || !item.quantity) {
            return res.status(400).json({
                status: "error",
                message: "Each item must have an ID and quantity"
            });
        }
        const getEachItemPriceQuery = `select price from fnb_items where id = ?`;
        const itemDetails = await db.query(getEachItemPriceQuery, [item.itemId]);
        if(itemDetails.length === 0) {
            return res.status(404).json({
                status: "error",
                message: `Item with ID ${item.itemId} not found`
            });
        }
        const itemPrice = itemDetails[0].price;
        const totalPrice = itemPrice * item.quantity;
        total_price += totalPrice;
    }
    const insertOrderQuery = `INSERT INTO food_orders (booking_id, total_amount, order_status, created_at) VALUES ( ?, ?, "confirmed", ?)`;
    await db.query(insertOrderQuery, [bookingId, total_price, new Date()]);


    res.status(201).json({
        status: "success",
        message: "F&B order created successfully"
    });
};
module.exports = {
    getFnbMenu,
    addFnbOrder
};
