const express = require('express');
const db = require('../config/database'); 

const app = express();

app.use(express.json());

const formatShowsAPIResponse = (shows, dateCheck, date) => {
    const formattedShows = shows.map(show => {
        return {
            theaterId: show.theaterId,
            theaterName: show.theaterName,
            shows:{
                showId: show.showId,
                showTime: show.showTime,
                showDate: show.showDate,
                format: show.format,
                language: show.language,
                screenName: show.screenName,
                soundSystem: show.soundSystem,
                totalSeats: show.totalSeats,
                prices:{
                    regular: show.regular,
                    premium: show.premium,
                    recliner: show.recliner
                }
            }            
        }
    })
    return {
        success: "true",
        shows: formattedShows
    }   
}


const getShowsAPI = async(req, res) => {
    const filters = {
        movie_id : req.query.movieId,
        city_id : req.query.cityId,
        show_date : req.query.date
    }

    let baseQuery = `select theaters.id as theaterId, theaters.name as theaterName, 
    shows.id as showId, shows.show_time as showTime, shows.show_date as showDate, shows.format as format, shows.language as language, screens.screen_name as screenName,
    screens.sound_system as soundSystem, screens.total_seats as totalSeats, shows.price_regular as regular, shows.price_premium as premium,
    shows.price_recliner as recliner from 
    ((shows inner join movies on shows.movie_id = movies.id) as T inner join theaters on T.theater_id = theaters.id) as Q inner join screens
    on shows.screen_id = screens.id`;

    const conditions = [];
    const values = [];

    for(let [key, value] of Object.entries(filters)){
        if(value !== undefined && value !== null && value !== '') {
            if (key === 'show_date') {
                conditions.push(`DATE(${key}) = ?`);
                values.push(value);
            } else {
                conditions.push(`${key} = ?`);
                values.push(value);
            }
        }
    }

    if(conditions.length > 0) {
        baseQuery += ' where ' + conditions.join(' and ');
    }

    try{
        const shows = await db.query(baseQuery, values);
        if(shows === undefined || shows.length === 0) {
            return res.status(404).json({ error: 'No shows found' });
        }
        const response = formatShowsAPIResponse(shows, filters.show_date !== undefined, filters.show_date);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching shows:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getShowsAPI
};
