// Required if we need auth for a specific kind of search. Example: deck search.
const authManager = require('../auth/manager');
// Config required for configuration of some calls.
const config = require('../magic-brian-server-config');
// Easily perform queries outside of server.
const request = require('request');
// Easily interact with mongo.
const Mongo = require('./mongo');
// Models used to contain the data associated with the request and response.
const CardSearch = require('../models/cardSearch');

class Search {
  static cardSearch(req, res) {
    const cardSearch = new CardSearch(req);

    request({
      url: `${config.MTG_API}/cards`,
      method: 'GET',
      encoding: 'latin1',
      qs: {
        name: new Buffer.from(cardSearch.query.name),
      }
    }, (err, response, body) => {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }

      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(body);
      } catch(err) {
        parsedResponse = body;
      }

      console.log('--------------------------------------------------------------------------------');

      // Parse the card responses.
      cardSearch.parse(parsedResponse);

      // Return them to frontend.
      res.send(cardSearch.cards);

      // Save them to mongo.
      const mongo = new Mongo();
      mongo.saveCards(cardSearch.cards);
    });
  }

  static cards(req, res) {
    const cardSearch = new CardSearch(req);

    console.log(cardSearch);

    const mongo = new Mongo();
    mongo.findCards(cardSearch.query, (err, cards) => {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }

      res.send(cards);
    });
  }
}

module.exports = Search;
