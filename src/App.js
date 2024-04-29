import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', album: '' });

  useEffect(() => {
    // Fetch songs from the backend API
    axios.get('/api/songs')
      .then(response => {
        setSongs(response.data);
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
      });
  }, []); // Empty dependency array to run only once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSong({ ...newSong, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to the backend API to add a new song
    axios.post('/api/songs', newSong)
      .then(response => {
        setSongs([...songs, response.data]); // Update the songs state with the new song
        setNewSong({ title: '', artist: '', album: '' }); // Clear the form fields
      })
      .catch(error => {
        console.error('Error adding song:', error);
      });
  };

  const handleDelete = (id) => {
    // Send a DELETE request to the backend API to remove the song with the specified id
    axios.delete(`/api/songs/${id}`)
      .then(() => {
        // Update the songs state by removing the deleted song
        setSongs(songs.filter(song => song.id !== id));
      })
      .catch(error => {
        console.error('Error deleting song:', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Server</h1>
        <div className="song-list">
          <h2>Songs</h2>
          <ul>
            {songs.map(song => (
              <li key={song.id}>
                <strong>{song.title}</strong> by {song.artist} (Album: {song.album})
                <button onClick={() => handleDelete(song.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="add-song-form">
          <h2>Add New Song</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input type="text" name="title" value={newSong.title} onChange={handleChange} />
            </div>
            <div>
              <label>Artist:</label>
              <input type="text" name="artist" value={newSong.artist} onChange={handleChange} />
            </div>
            <div>
              <label>Album:</label>
              <input type="text" name="album" value={newSong.album} onChange={handleChange} />
            </div>
            <button type="submit">Add Song</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
