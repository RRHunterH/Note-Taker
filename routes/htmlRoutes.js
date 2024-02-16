const path = require('path');
const router = require('express').Router();

router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/routes/notes.html'));
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/routes/index.html'));
});

module.exports = router;
