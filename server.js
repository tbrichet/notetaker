// Access notes data from JSON file
const { notes } = require('./db/db.json');
//console.log(notes);
//console.log(notes.length);


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

    // Function to validate user input
    function validateNote(note) {
        if(!note.title || typeof note.title !== 'string') {
            return false;
        }
        if (!note.text || typeof note.text !== 'string') {
            return false
        }
        return true;
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
        let setId = notes.length +1;
        req.body.id = setId.toString();

        // Validate user input
        if(!validateNote(req.body)) {
            req.status(400).send('Your note is not properly formatted');

        } else {

        // Call function that creates new note
        const newNote = createNewNote(req.body, notes);

        res.json(newNote);
        }
    });

// HTML Routes

    // Return the notes.html file
    app.get("/notes", (req, res) => {
        res.sendFile(path.join(__dirname, "./public/notes.html"));
    });

    // Return index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

// DELETE Routes

    // Identify note by ID
    app.get("/api/notes/:id", (req, res) => {
        let specificNote = notes[req.params.id];
        res.json(specificNote);
    })

    // Allow user to delete notes
    app.delete("/api/notes/:id", (req, res) => {
        // Splice array at specific id, remove 1 item
        let noteToDelete = req.params.id -1;

        //let updatedNotes = notes.splice(noteToDelete, 1);
        notes.splice(noteToDelete, 1);

        // Update IDs for existing notes
        for (i=0; i < notes.length; i++) {
            let newIdValue = i+1;
            notes[i].id = newIdValue;
        }

        // Update JSON file
        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify({notes}, null, 2)
        );

        res.send('Note Deleted');
    });



//Tell the server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});