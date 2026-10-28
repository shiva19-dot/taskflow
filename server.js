
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// Read JSON data sent by the frontend
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// Display the frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/taskflow')
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'TaskFlow API is working!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`TaskFlow server is running at http://localhost:${PORT}`);
});
