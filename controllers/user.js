// Required if we need auth for a specific kind of search. Example: deck search.
const authManager = require('../auth/manager');
// Used to validate input from the user.
const validator = require('validator');
// Config required for configuration of some calls.
const config = require('../magic-brian-server-config');
// Easily interact with mongo.
const Mongo = require('./mongo');
// Auth model object.
const Auth = require('../models/auth');
// Registration model object.
const Registration = require('../models/registration');


class User {

  static auth(req, res) {
    const auth = new Auth(req);

    if (auth.validAuth()) {
      // Let the frontend know it's still valid.
      res.send({ auth: auth.rawAuth, email: auth.email, status: 'VALID_AUTH' });
      return;
    } else if (auth.validRefresh()) {
      // Lets generate a new auth for the frontend.
      const mongo = new Mongo();

      mongo.getUser(auth.email, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: err, message: 'Error finding the user.' });
          return;
        }

        if (!user || !Array.isArray(user) || user.length === 0) {
          res.status(400).send({ message: 'Could not find user.' });
          return;
        }

        const foundUser = user[0];

        mongo.updateAuth({ user:foundUser, auth }, (err, newAuth) => {
          if (err) {
            res.status(400).send({ error: err, message: 'There was an error updating auth for the user.' });
            return;
          }

          res.send({ auth: newAuth.auth, email: auth.email, status: 'NEW_AUTH_GENERATED' });
          return;
        });
      });
    } else {
      // Nothing is valid and they must sign in again.
      res.status(401).send({ message: 'User has been signed out. Please sign in again.' });
      return;
    }
  }

  static register(req, res) {
    const registration = new Registration(req);

    /*
      TODO:
      1. Check if the user is already registered and send back an error.
      2. Hash password and create a user object in mongo.
        2a. Hash password.
        2b. Create user object in mongo.
        2c. Create and save auth and refresh token.
        2d. Send the auth and refresh token back to the user.
    */

    const mongo = new Mongo();

    mongo.getUser(registration.email, (err, user) => {
      if (err) {
        console.log('We already have a user?');
        console.log(err);
        res.status(500).send({ error: err, message: 'Error finding the user.' });
        return;
      }
      if (user.length !== 0) {
        // The user is already registered.
        res.status(409).send({ userExists: true, message: 'The user already exists.' });
        console.log('The user already exists.');
        return;
      }

      // We don't have the user, so lets create them.
      mongo.createUser(registration, (err, user) => {
        if (err) {
          // Failed to create the user.
          console.log(err);
          res.status(500).send({ error: err, message: 'Failed to create the user.' });
          return;
        }
        // Generate the user auth and refresh tokens.
        mongo.generateAuth({ user: user, userInfo: registration }, (err, auth) => {
          if (err) {
            // Failed to generate auth.
            console.log(err);
            res.status(500).send({ error: err, message: 'Failed to generate auth for user.' });
            return;
          }

          if (auth && auth.auth) {
            res.send({ auth: auth.auth, refresh: auth.refreshToken });
            return;
          }
        });
      });
    });
  }
}

module.exports = User;
