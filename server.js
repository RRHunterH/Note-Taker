const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});