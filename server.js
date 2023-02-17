const express = require('express');
const { appendFile } = require('fs');
const path = require('path'); //for path-joining needs
// const api = require('./routes/dispatch.js'); //this is for relegating to the dispatch file

const PORT = 3001; // for easy changing // change to the heroku thing

const app = express(); //initialise the app

app.use(express.json());
app.use(express.urlencoded({extended: true  })); // middleware data-handling utils from express

// app.use('/api', api); // redirect any /api/ calls to the dispatch
app.use(express.static('public')); //allow access to public folder?



app.get('/api/notes', (req,res) => {
      res.json('Notes GET received.');
});

app.post('/api/notes', (req,res) => {
  res.json('Notes POST received.');
});

app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);