// Access notes data from JSON file
const { notes } = require('./db/db.json');

// Packages variables
const express = require('express');
const e = require('express');
const fs = require('fs');
const path = require('path');

// Tell app to use an environment variable (to work with Heroku)
const PORT = process.env.PORT || 3000;

// Instantiate the server
const app = express();


//Tell the server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});