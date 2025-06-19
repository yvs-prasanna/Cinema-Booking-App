const express = require('express');
const db = require('../config/database'); 

const app = express();
app.use(express.json());

const convertSeatLayout = (rawData) => {
  const layout = {};

  for (const seat of rawData) {
    const category = seat.seatCategory;

    if (!layout[category]) {
      layout[category] = {
        rows: [],
        seatsPerRow: seat.totalSeats,
        price: seat[category]
      };
    }

    layout[category].rows.push(seat.rowName);
  }

  return {
    success: true,
    screen: rawData[0]?.screenName || 'Unknown',
    seatLayout: layout
  };
};

const getAllSeatIdentifiers = async(arr) => {
    const res = [];
    for(const seat of arr){
        res.push(seat.seat_identifier);
    }
    return res;
}


const getSeatLayout = async(req, res) => {
    const showId = req.params.showId;
    const query = `select screens.screen_name as screenName, seat_category as seatCategory, shows.price_regular as regular, 
    shows.price_premium as premium, shows.price_recliner as recliner, row_name as rowName, count(*) as totalSeats from 
    (seat_layout inner join shows on seat_layout.screen_id = shows.screen_id) as T inner join 
    screens on screens.id = T.screen_id where shows.id = ? 
    group by seat_category, row_name`;
    const bookedSeatsQuery = `select seat_identifier from booked_seats`;
    const bookedSeats = await db.query(bookedSeatsQuery);
    const response = await db.query(query, [showId]);
    res.send({
        ...convertSeatLayout(response),
        bookedSeats: await getAllSeatIdentifiers(bookedSeats)
    });
}

const getSeatLayoutDetails = async(req, res) => {
  const query = `select * from seat_layout`;
  const response = await db.query(query);
  res.send(response);
}

module.exports = {
    getSeatLayout,
    getSeatLayoutDetails
};
