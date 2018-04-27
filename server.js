const express = require('express');
const config = require('./magic-brian-server-config');

const PORT = 8080;

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.listen(PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${PORT}`);