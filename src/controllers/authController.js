const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); 

const app = express();
app.use(express.json());

const registerAPI = async(req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }
    const dbUserQuery = `select * from users where name = ?`;
    const dbUser = await db.query(dbUserQuery, [username]);
    if(dbUser === undefined || dbUser.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = `insert into users (name, password_hash, email) values (?, ?, ?)`;
        await db.query(insertUserQuery, [username, hashedPassword, email]);
        return res.status(201).json({ success: "true",message: 'User registered successfully', userId: db.lastID });
    }
    else{
        return res.status(400).json({ error: 'Username already exists' });
    }
}

const loginAPI = async(req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    if(email === process.env.ADMIN_EMAIL){
        return adminLogin(req, res)
    }
    
    const dbUserQuery = `select * from users where name = ?`;
    const dbUser = await db.query(dbUserQuery, [username]);
    if(dbUser === undefined || dbUser.length === 0) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    else{
        const comparePassword = await bcrypt.compare(password, dbUser[0].password_hash);
        if(comparePassword) {
            const jwtToken = jwt.sign({ id: dbUser[0].id, email: dbUser[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({success: "true", message: 'Login successful', token: jwtToken , user: dbUser[0]});
        }
        else{
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    }
}

//Admin login
const adminLogin = async(req, res) => {
    const {username, password, email} = req.body;
    if(!email || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const dbUserQuery = `select * from admin_users`;
    const dbUser = await db.query(dbUserQuery);
    if(dbUser === undefined || dbUser.length === 0) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    else{
        const comparePassword = await bcrypt.compare(password, dbUser[0].password_hash);
        if(comparePassword) {
            const jwtToken = jwt.sign({ id: dbUser[0].id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.email = email
            return res.status(200).json({success: "true", message: 'Login successful', token: jwtToken , user: dbUser[0]});
        }
        else{
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    }

}

module.exports = {
    registerAPI,
    loginAPI,
    adminLogin
};  