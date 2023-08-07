require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 5000;

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

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
  });
  
// Define the endpoint
app.get('/api/data', (req, res) => {
    const { topic } = req.query;
    let query = '';

    // Assign the query based on the mqttTopic
    if (topic == 'co2') {
        query = 'SELECT date, carbon_dioxide AS value FROM ' + tableName;
    } else if (topic == 'temp') {
        query = 'SELECT date, temperature AS value FROM ' + tableName;
    } else if (topic == 'hum') {
        query = 'SELECT date, humidity AS value FROM ' + tableName;
    } else if (topic == 'light') {
        query = 'SELECT date, light AS value FROM ' + tableName;
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

// Start the server
// https.createServer(options, app).listen(5000, () => {
//     console.log(`Server running on port 5000`);
//   });
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
