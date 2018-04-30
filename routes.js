const index = require('./controllers/index');
const search = require('./controllers/search');

class Routes {
  static setup(app) {
    // Just to check if it's alive.
    app.get('/', index.show);

    // Search for cards.
    app.post('/search', search.cardSearch);

    // Search mongo for cards.
    app.post('/cards', search.cards);
  }
}

module.exports = Routes;
