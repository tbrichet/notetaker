// Access notes data from JSON file
const notes = require('./db/db.json');
console.log(notes);

// Packages variables
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

// Tell app to use an environment variable (to work with Heroku)
const PORT = process.env.PORT || 3000;

// Instantiate the server
const app = express();

// Middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Helper functions

// Function accepts the POST route's req.body value and the array where we want to add the data
function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);
    // Add new note to JSON file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return note;
};

// API GET Routes

    // Read the db.json file and return all saved notes as JSON
    app.get("/api/notes", (req, res) => {
        return res.json(notes);
    });

// POST Routes

    // Allow user to create new note and add to notes array
    app.post("/api/notes", (req, res) => {
        // Set id for note
        req.body.id = notes.length.toString();

        // Call function that creates new note
        const newNote = createNewNote(req.body, notes);

        res.json(newNote);
    });

    // // Allow user to create new note and add to notes array
    // app.post("/api/notes", (req, res) => {
    //     // Variable for new created note
    //     let createdNote = req.body;
    //     // Add new created note to notes array
    //     notes.push(createdNote);
    //     // Stringify
    //     let updatedNotes = JSON.stringify(notes);
    //     // Update JSON file
    //     fs.writeFile("./db/db.json", updatedNotes, function(err) {
    //         if (err) {
    //             return console.log(err);
    //         }
    //     })
    //     res.json(createdNote);
    // });

// HTML Routes

    // Return the notes.html file
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname), "./public/notes.html");
    });

    // Return index.html file
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });



//Tell the server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});