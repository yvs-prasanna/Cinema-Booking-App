const express = require('express');
const app = express();
const db = require('../config/database'); 
app.use(express.json());


const getLocationsAPI = async(req, res) => {
    const getLocationsQuery = `SELECT cities.id as id, cities.name as name, cities.state as state,
    count(*) as theaterCount FROM cities inner join theaters on cities.id = theaters.city_id group by cities.id`;
    try {
        const locations = await db.query(getLocationsQuery);
        if (locations === undefined || locations.length === 0) {
            return res.status(404).json({ error: 'No locations found' });
        }
        return res.status(200).json({success: "true", cities: locations});
    } catch (error) {
        console.error('Error fetching locations:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTheatersAPI = async(req, res) => {
    const filters = {
        city_id : req.query.cityId,
        id : req.query.movieId
    }

    let baseQuery = `SELECT theaters.id as id, theaters.name as name, theaters.address as address,         
    theaters.latitude as latitude, theaters.longitude as longitude, count(*) as screens FROM theaters inner join movies on theaters.id = movies.theater_id group by 
    theaters.id`;
    const values = [];
    const conditions = [];

    for(let [key, value] of Object.entries(filters)) {
        if(value !== undefined && value != null && value !== '') {
            if (key === 'city_id') {
                conditions.push(`${key} = ?`);
                values.push(value);
            } else if (key === 'id') {
                conditions.push(`movies.id = ?`);
                values.push(value);
            }
        }
    }

    if(conditions.length > 0) {
        baseQuery += ' where ' + conditions.join(' and ');
    }

    try{
        const theaters = await db.query(baseQuery, values);
        if(theaters === undefined || theaters.length === 0) {
            return res.status(404).json({ error: 'No theaters found' });
        }
        return res.status(200).json({success: "true", theaters: theaters});
    } catch (error) {
        console.error('Error fetching theaters:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getLocationsAPI,
    getTheatersAPI
};
