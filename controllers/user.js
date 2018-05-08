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
// Login model object.
const Login = require('../models/login');
// Logout model object.
const Logout = require('../models/logout');


class User {

  static auth(req, res) {
    const auth = new Auth(req);

    console.log(auth);
    console.log(auth.validAuth());
    console.log(auth.validRefresh());

    // Check if the auth will expire soon (in the next day), if so update the auth just to ensure the user won't be using
    // an expired auth during a session.

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

        console.log('The user!');
        console.log(user);

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

  static login(req, res) {
    const login = new Login(req);

    console.log(login);

    const mongo = new Mongo();

    // Confirm that the user has a valid email and password.
    mongo.userLogin(login, (userLoginErr, userList) => {
      if (userLoginErr) {
        console.log(userLoginErr);
        res.status(500).send({ error: userLoginErr, message: 'Error validating user.' });
        return;
      }
      console.log('The user!');
      console.log(userList);
      if (!userList.length) {
        res.send({ message: 'Invalid email or password.' });
        return;
      }

      const user = userList[0];

      // Delete the old auth for the user with the same ipHash (if any).
      mongo.deleteAuth({ user, userInfo: login }, (deleteErr, deletedAuth) => {
        console.log('Deleting auth.');
        console.log(deleteErr);
        console.log(deletedAuth);
        console.log(user);

        // Generate a new auth for the user.
        mongo.generateAuth({ user, userInfo: login }, (generateAuthErr, auth) => {
          if (generateAuthErr) {
            // Failed to generate auth.
            console.log(generateAuthErr);
            res.status(500).send({ error: generateAuthErr, message: 'Failed to generate auth for user.' });
            return;
          }
          console.log('Auth');
          console.log(auth);
          res.send({ auth: auth.auth, refresh: auth.refreshToken });
        });
      });
    });
  }

  static logout(req, res) {
    const logout = new Logout(req);

    const mongo = new Mongo();

    console.log(logout);

    if (!logout.auth || !logout.auth.userId) {
      res.status(401).send({ message: 'Failed to logout with the current auth.' });
      return;
    }

    mongo.deleteAuth({ user: { _id: logout.auth.userId }, userInfo: logout }, (deleteErr, deletedAuth) => {
      res.send({ logoutSuccess: true });
    });
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
