const express = require('express');
const db = require("../config/database");

const app = express();
app.use(express.json());

//add new movie
const addMovie = async (req, res) => {
    const { title, synopsis, duration, rating, language, formats, cast, crew,  releaseDate, genre , theaterId} = req.body;
    if (!title || !synopsis || !duration || !rating || !language || !formats || !cast || !crew || !releaseDate || !genre || !theaterId) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const query = 'INSERT INTO movies (title, synopsis, duration_minutes, rating, language, formats, cast, crew, release_date, genre, theater_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [title, synopsis, duration, rating, language, formats.join(','), cast.join(','), crew.join(','), releaseDate, genre.join(','), theaterId, new Date().toISOString().split('T')[0] ];
        
        await db.query(query, values);
        res.status(201).json({ message: 'Movie added successfully'});
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const createShow = async (req, res, next) => {
  try {
    const {
      movieId, screenId, showDate, showTime, format, language,
      priceRegular, pricePremium, priceRecliner
    } = req.body;
    
    // Verify movie and screen exist
    const movie = await db.get('SELECT id FROM movies WHERE id = ?', [movieId]);
    const screen = await db.get('SELECT id FROM screens WHERE id = ?', [screenId]);
    
    if (!movie || !screen) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie or screen ID'
      });
    }
    
    const result = await db.run(`
      INSERT INTO shows (
        movie_id, screen_id, show_date, show_time, format, language,
        price_regular, price_premium, price_recliner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      movieId, screenId, showDate, showTime, format, language,
      priceRegular, pricePremium, priceRecliner
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      showId: result.id
    });
    
  } catch (error) {
    next(error);
  }
};

const updateShow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const allowedFields = [
      'show_date', 'show_time', 'format', 'language',
      'price_regular', 'price_premium', 'price_recliner', 'is_active'
    ];
    
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    values.push(id);
    
    const result = await Database.run(`
      UPDATE shows SET ${updateFields.join(', ')} WHERE id = ?
    `, values);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Show updated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};



module.exports = {
    addMovie,  
    createShow,
    updateShow     
};