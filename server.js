const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// ./routes/api/users
const users = require('./routes/api/users');

// body-parser Middleware
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}));

// Entry point
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

// Access to the public folder
app.use(express.static('public'));

// Port from .env file, or 5000 if not defined
const PORT = process.env.PORT || 5000;

// Database configuration
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/exercise', users)
// Listen
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));