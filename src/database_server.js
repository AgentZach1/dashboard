require('dotenv').config();

import express from 'express';
import { createConnection } from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors()); // Use this after the variable declaration

// MySQL Connection
const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database Connected Successfully!');
});

app.get('/readings', (req, res) => {
    const sql = 'SELECT * FROM readings';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No results found');
        }
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));
