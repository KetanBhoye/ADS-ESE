const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid'); // Import the uuid function from the uuid package

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Connect to Cassandra
const client = new Client({
  contactPoints: ['localhost'], // Update with your Cassandra host
  localDataCenter: 'datacenter1', // Update with your datacenter
  keyspace: 'music_keyspace' // Update with your keyspace name
});

// Connect to Cassandra cluster
client.connect()
  .then(() => console.log('Connected to Cassandra'))
  .catch(err => console.error('Error connecting to Cassandra', err));

// Route for fetching all songs
app.get('/api/songs', async (req, res) => {
  try {
    const query = 'SELECT * FROM songs'; // Query to fetch all songs
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching songs', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for inserting a new song
app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist, album } = req.body; // Extract song details from request body
    const id = uuidv4(); // Generate a UUID for the new song ID
    const query = 'INSERT INTO songs (id, title, artist, album) VALUES (?, ?, ?, ?)';
    await client.execute(query, [id, title, artist, album]);
    res.status(201).json({ id, title, artist, album }); // Respond with the details of the inserted song
  } catch (err) {
    console.error('Error inserting song', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for deleting a song by ID
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract song ID from request parameters
    const query = 'DELETE FROM songs WHERE id = ?';
    await client.execute(query, [id]);
    res.sendStatus(204); // Respond with No Content status code if deletion is successful
  } catch (err) {
    console.error('Error deleting song', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
