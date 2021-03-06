const index = require('./controllers/index');
const search = require('./controllers/search');
const user = require('./controllers/user');

class Routes {
  static setup(app) {
    // Just to check if it's alive.
    app.get('/', index.show);

    // Search for cards.
    app.post('/search', search.cardSearch);

    // Search mongo for cards.
    app.post('/cards', search.cards);

    // Register a user.
    app.post('/register', user.register);

    // Login as a user.
    app.post('/login', user.login);

    // Logout a user and delete auth.
    app.post('/logout', user.logout);

    // Confirm/Update auth for a user
    app.post('/auth', user.auth);
  }
}

module.exports = Routes;
