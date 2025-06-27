const express = require('express');
const db = require('../config/database');

const app = express();
app.use(express.json());

// Get all movies
 const getMoviesAPI = async (req, res) => {
    const filters = {
        city_id : req.query.cityId,
        language : req.query.language,
        genre : req.query.genre,    
        formats : req.query.format
    }
    let baseQuery = `select  movies.id, title, duration_minutes as duration, rating, genre, language,formats, poster_url as posterUrl, release_date as releaseDate, imdb_rating as imdbRating from (movies inner join theaters on movies.theater_id = theaters.id)
    as T inner join cities on T.city_id = cities.id`;
    const conditions = [];
    const values = [];
   
    for(let [key, value] of Object.entries(filters)) {
        if(value !== undefined && value !== null && value !== '') {
            if (key === 'genre' || key === 'language' || key === 'formats') {
                conditions.push(`${key} LIKE ?`);
                values.push(`%${value}%`);
            } else {
                conditions.push(`city_id = ?`);
                values.push(value);
            }
        }
    }

    if (conditions.length > 0) {
        baseQuery += ' where ' + conditions.join(' and ');
    }

    try{
        let movies = await db.query(baseQuery, values);
        if(movies === undefined || movies.length === 0) {
            return res.status(404).json({ error: 'No movies found' });
        }
        movies = movies.map(movie => ({
      ...movie,
      genre: JSON.parse(movie.genre || '[]'),
      language: JSON.parse(movie.language || '[]'),
      formats: JSON.parse(movie.formats || '[]'),
      cast: JSON.parse(movie.cast || '[]'),
      crew: JSON.parse(movie.crew || '{}')
    }));
        return res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
 
// Get movie by ID
 const getMovieByIdAPI = async (req, res) => {    
    const movieId = req.params.id;
    try{
        const getMovieQuery = `select * from movies where id = ?`;
        let movie = await db.query(getMovieQuery, [movieId]);
        if(movie === undefined || movie.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        movie = movie[0];
        const formattedMovie = {
      ...movie,
      duration: `${movie.duration_minutes} mins`,
      genre: JSON.parse(movie.genre || '[]'),
      language: JSON.parse(movie.language || '[]'),
      formats: JSON.parse(movie.formats || '[]'),
      cast: JSON.parse(movie.cast || '[]'),
      crew: JSON.parse(movie.crew || '{}')
    };
        return res.status(200).json(formattedMovie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const upcomingMoviesAPI = async (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0];  
 
    const query = `SELECT * FROM movies WHERE release_date > ?`;
    try {
        const movies = await db.query(query, [currentDate]);
        if (movies === undefined || movies.length === 0) {
            return res.status(404).json({ error: 'No upcoming movies found' });
        }
        const formattedMovies = movies.map(movie => ({
      ...movie,
      duration: `${movie.duration_minutes} mins`,
      genre: JSON.parse(movie.genre || '[]'),
      language: JSON.parse(movie.language || '[]'),
      formats: JSON.parse(movie.formats || '[]'),
      cast: JSON.parse(movie.cast || '[]'),
      crew: JSON.parse(movie.crew || '{}')
    }));
        return res.status(200).json(formattedMovies);
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getMoviesAPI,               
    getMovieByIdAPI,
    upcomingMoviesAPI
};