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
          console.log(extantNotes);
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
        const extantNotes = JSON.parse(data);
        const newNote = {
          id:uniqid(),
          title,
          text,
        }
        extantNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(extantNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes updated.')
              );

        console.log('POST request received -');
        console.log(newNote);
        res.status(201).json({status:'success',body:extantNotes});
      }
    }
  });
  // res.json('Notes POST received.');
});

app.delete('/api/notes/:noteId', (req,res) => {
console.log();
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(data);
      res.json('An error has occurred when reading notes database.');
    } else {
      const {id} = req.body
      const extantNotes = JSON.parse(data);
      let spliceId;
      for (x=0;x<extantNotes.length;x++) {
        if (req.params.id === id) {
          spliceId=x;
        }
      }
      if (spliceId) { if (extantNotes.length===1) {extantNotes.length=0} else
        {extantNotes.splice(spliceId-1,1);}}
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





// res.json('Notes DELETE received, with id '+req.params.id);
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