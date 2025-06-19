const express = require('express');
const db = require("../config/database")

const app = express();
app.use(express.json());

const getUsersAPI = async(req, res) => {
    try {
        const users = await db.query("SELECT * FROM users");
        res.status(200).json(users);
    }   
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getUsersAPI
};