const config = require('../magic-brian-server-config');
// const mongoose = require('mongoose');
const MongooseModels = require('../models/mongooseModels');
const escape = require('escape-string-regexp');

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
    const expression = new RegExp(regex, 'g');
    const query = {
      name: expression,
    };
    Card.find(query, null, (err, cards) => {
      mongoose.connection.close();
      callback(err, cards);
    });
  }

}

module.exports = Mongo;