const express = require('express');

const db = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const movieRoutes = require('./src/routes/movieRoutes');
const theaterRoutes = require('./src/routes/theaterRoutes');
const showRoutes = require('./src/routes/showRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const fnbRoutes = require('./src/routes/fnbRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const adminRoutes = require("./src/routes/adminRoutes")
const seatRoutes = require('./src/routes/seatRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(express.json());
// Node.js Express backend
const cors = require("cors");
app.use(cors());


require('dotenv').config();

const connectDB = async () => {
  try {
    await db.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/fnb', fnbRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/admin", adminRoutes)
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

