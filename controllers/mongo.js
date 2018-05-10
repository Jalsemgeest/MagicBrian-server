const config = require('../magic-brian-server-config');
// const mongoose = require('mongoose');
const MongooseModels = require('../models/mongooseModels');
const escape = require('escape-string-regexp');
const AuthManager = require('../auth/manager');

class Mongo {
  /**
   *  This will save the data to the mongodb. It should be an array of card objects.
   */
  saveCards(data = []) {
    if (!data) {
      return;
    }

    if (Array.isArray(data)) {
      const models = new MongooseModels();

      // TODO: Create an environment variable so we can more easily target the correct instance.
      const mongoose = require('mongoose');
      mongoose.connect(`mongodb://localhost/MagicBrian`);

      const Card = models.card(mongoose);

      Card.create(data, (err, results) => {
        if (err) {
          // TODO: Log the error.
          console.log(err);
        }
        mongoose.connection.close();
      });
    }
  }

  /**
   *  This will find the cards we currently have given the query in our db.
   */
  findCards(data, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const Card = models.card(mongoose);

    const regex = escape(data.name);
    const expression = new RegExp(regex, 'i');
    const query = {
      name: expression,
    };
    Card.find(query, null, (err, cards) => {
      mongoose.connection.close();
      callback(err, cards);
    });
  }

  /**
   *  Check if a user exists in the database.
   */
  getUser(username, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const User = models.user(mongoose);

    const query = {
      username: username,
    };

    User.find(query, null, (err, user) => {
      mongoose.connection.close();
      callback(err, user);
    });
   }

  /**
   *  Adds a user to the database..
   */
  createUser(registration, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const User = models.user(mongoose);

    User.create({
      username: registration.username,
      email: registration.email,
      passwordHash: registration.password,
      createdDate: Date.now(),
      lastLogin: Date.now(),
    }, (err, user) => {
      mongoose.connection.close();
      callback(err, user);
    });
  }

  generateAuth({ user, userInfo }, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    console.log('Going to generate auth...');
    console.log(user);

    const Auth = models.auth(mongoose);
    const tokens = AuthManager.generate({ userId: user._id, username: user.username, ipHash: userInfo.ipHash });

    console.log('Tokens:');
    console.log(tokens);

    if (tokens.error) {
      callback({ error: tokens.error, message: 'Failed to generate the tokens.' }, null);
      return;
    }

    console.log(user);
    Auth.create({
      userId: user._id,
      ipHash: userInfo.ipHash,
      auth: tokens.auth,
      refreshToken: tokens.refresh,
      generated: Date.now(),
      lastUsed: Date.now(),
    }, (err, auth) => {
      mongoose.connection.close();
      callback(err, auth);
    });
  }

  updateAuth({ user, auth }, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const Auth = models.auth(mongoose);

    const tokens = AuthManager.generate({ userId: user._id, username: user.username, ipHash: auth.ipHash });

    Auth.update({ ipHash: auth.auth.ipHash, username: user.username, userId: user._id },
                { $set: { auth: tokens.auth, lastUsed: Date.now() }},
                (err, updatedAuth) => {
                  console.log(err);
                  console.log(updatedAuth);
                  mongoose.connection.close();
                  callback(err, { auth: tokens.auth });
                });
  }

  userLogin(login, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const User = models.user(mongoose);

    User.find({ username: login.username, passwordHash: login.password }, (err, user) => {
      mongoose.connection.close();
      callback(err, user);
    });
  }

  deleteAuth({ user, userInfo }, callback = ()=>{}) {
    const models = new MongooseModels();

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://localhost/MagicBrian`);

    const Auth = models.auth(mongoose);

    Auth.remove({ userId: user._id, ipHash: userInfo.ipHash }, (err, result) => {
      mongoose.connection.close();
      callback(err, result);
    });
  }
}

module.exports = Mongo;