const express = require('express');
const fs = require('fs');
// import a utility for generating unique ids
const uniqid = require ('uniqid');
const path = require('path'); //for path-joining needs

const PORT = process.env.PORT || 3001; // for easy changing // change to the heroku thing

//initialise the app
const app = express(); 

// middleware data-handling utils from express
app.use(express.json());
app.use(express.urlencoded({extended: true  })); 

app.use(express.static('public')); //allow access to public folder?

//Since there's only one api of interest, no need for modularisation.

app.get('/api/notes', (req,res) => {
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(data);
          res.json('An error has occurred when reading notes database.');
        } else {
          const extantNotes = JSON.parse(data);
          console.log('GET request received -');
          // respond with the contents of the notes
          res.json(extantNotes);
        }
      });
      
});

app.post('/api/notes', (req,res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(data);
      res.json('An error has occurred when reading notes database.');
    } else {
      const {title, text} = req.body
      if(title) {
        // read existing notes
        const extantNotes = JSON.parse(data);
        // construct a new note object, adding a unique id via uniqid() package
        const newNote = {
          id:uniqid(),
          title,
          text,
        }
        // add new note to existing notes
        extantNotes.push(newNote);
        // write the updated note object to the array in db.json
        fs.writeFile(
          './db/db.json',
          JSON.stringify(extantNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes updated.')
              );

        console.log('POST request received -');
        res.status(201).json({status:'success',body:extantNotes});
      }
    }
  });
  // res.json('Notes POST received.');
});

app.delete('/api/notes/:noteId', (req,res) => {
  let spliceId;
  suppliedId=req.params.noteId;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(data);
      res.json('An error has occurred when reading notes database.');
    } else {
      const extantNotes = JSON.parse(data);
      for (x=0;x<extantNotes.length;x++) {
        if (req.params.noteId === extantNotes[x].id) {
          // if there is a match, record the index at which the match occurred
          spliceId=x;
        }
      }
      // check whether a match was recorded; if so, splice the element at
      // the corresponding index out of the array
      if (spliceId+1) {extantNotes.splice(spliceId,1);}
        // write the updated file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(extantNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes updated.')
              );

        console.log('DELETE request received -');
        res.status(201).json({status:'success',body:extantNotes});
      
    }
});

// res.json('Notes DELETE received, with id '+req.params.noteId);
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