const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const config = require('./magic-brian-server-config');
const routes = require('./routes');

const PORT = 8080;

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the routes.
app.use(express.Router());
routes.setup(app);

const server = app.listen(process.env.PORT || 8080, config.HOST, () => {
  const { address, port } = server.address();
  console.log(`Magic Brian API listening at http://${address}:${port}`);
});