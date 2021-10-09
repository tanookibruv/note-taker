const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001
const app = express();

// Allowing the app to display properly and function
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

// Route to get to index.html when server starts
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Route to get to notes.html when server is running
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//Posting notes to db.json
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let database;
        (data != undefined) ? database = JSON.parse(data) : database = Array(0);

        let noteData = {
            title: `${req.body.title}`,
            text: `${req.body.text}`
        };

        database.push(noteData);

        fs.writeFile('./db/db.json', JSON.stringify(database, null, 2), (err, data) => {
            console.log('New note was saved.')
            if (err) throw err;
            
            noteData.id = database.length;

            return res.send(noteData);
        });
    });
});


// Retrieving notes from db
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let newNote = JSON.parse(data);
        newNote.forEach((element, id) => {
            element.id = id++});
        return res.send(newNote);
    });
});

// Deleting notes from the db
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;

        let database = JSON.parse(data)
        database.splice(id - 1, 1);
        fs.writeFile('./db/db.json', JSON.stringify(database, null, 2), (err, data) => {
            if (err) throw err;
            console.log('Note was deleted.')
        })

        database.forEach((element, id) => {
            element.id = id++;
        });

        return res.send(database);
    })
})

app.listen(PORT, () => console.log (`Sever is listening to PORT ${PORT}`));