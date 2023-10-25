require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 5000;
const limit = 1000;

const tableName = "readings_tent";

const corsOptions = {
    origin: ['https://connect.weiss.land', 'http://localhost:3000'],
    optionsSuccessStatus: 200
}

// Enable CORS
app.use(cors(corsOptions));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// New MySQL Connection for Unidish
const unidishDb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.UNIDISH_DB_USER,
    password: process.env.UNIDISH_DB_PASSWORD,
    database: process.env.UNIDISH_DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
  });
  
// Connect to Unidish database
unidishDb.connect((err) => {
    if (err) throw err;
    console.log('Connected to the Unidish database ooooooo');
});

app.get('/api/unidish', (req, res) => {
    console.log('Received request for /api/unidish');
    const { table } = req.query;
    let query = '';

    if (table == 'all') {
        query = 'SELECT * FROM COMMENT, COMMENT_DISLIKES, COMMENT_LIKES, DINING_HALL, MENU_ITEM, RESTAURANT, REVIEW, REVIEW_DISLIKES, REVIEW_LIKES, USER;'
    }
    else {
        query = 'SELECT * FROM ' + table + ';';
    }

    unidishDb.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

// Define the endpoint
app.get('/api/data', (req, res) => {
    const { topic } = req.query;
    let query = '';

    // Assign the query based on the mqttTopic
    if (topic == 'co2') {
        query = 'SELECT * FROM (SELECT id, date, carbon_dioxide AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'temp') {
        query = 'SELECT * FROM (SELECT id, date, temperature AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'hum') {
        query = 'SELECT * FROM (SELECT id, date, humidity AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'light') {
        query = 'SELECT * FROM (SELECT id, date, light AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else {
        res.status(400).json({ error: 'Invalid topic' });
        return;
    }
    console.log("Executing query for " + topic + " and returning")
    // Execute the query and return the results
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});




app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
