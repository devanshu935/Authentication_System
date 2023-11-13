// require the library
const mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://127.0.0.1:27017/authentication');

// acquire the connection(to check if it is successful)
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

//up and running then print the message
db.once('open', function(){
    console.log('Connected to database :: MongoDB');
});

module.exports = db;