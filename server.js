// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;


// Configure body-parser
app.use(bodyParser.json());  // Use json() for API requests

// Enable CORS for all origins
app.use(cors());

// PostgreSQL connection URL
const connectionString = "postgres://default:8DoUPnBvMzq6@ep-fancy-sun-a4kcn3tl.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require";

// PostgreSQL configuration
const pool = new Pool({
    connectionString: connectionString
});

app.get('/api/test', (req, res) => {
    res.send('Hello, World!');
  });
  


// Route to handle API data submission
app.post('/api/submit', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Insert data into the database
        await pool.query(
            'INSERT INTO FormData (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );

        res.status(200).send('Form data has been saved successfully!');
    } catch (err) {
        console.error('Database error', err);
        res.status(500).send('An error occurred while saving data.');
    }
});

async function createTableIfNotExists() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS FormData (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('Table created or already exists.');
    } catch (err) {
        console.error('Error creating table', err);
    }
}

// Create table and insert sample data
createTableIfNotExists().then(() => {
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
