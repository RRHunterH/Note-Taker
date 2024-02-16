const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();

function getNotes() {
  const data = fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8');
  return JSON.parse(data) || [];
}

function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(notes), 'utf8');
}

router.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

router.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

module.exports = router;
