// Used to validate input from the user.
const validator = require('validator');
// The model for the card.
const Card = require('./card');

class CardSearch {
  constructor(data) {
    // ex. Oloro
    this.query = {
      name: validator.escape(data.body.name),
    };

    // Array we will populate with values to send back to client.
    this.cards = [];
  }

  parse(cardResponse) {
    const cards = [];

    if (cardResponse && cardResponse.cards && Array.isArray(cardResponse.cards)) {
      if (cardResponse.cards.length === 1) {
        cards.push(new Card(cardResponse.cards[0]));
      } else {
        for (let i = 0; i < cardResponse.cards.length; i++) {
          let card = new Card(cardResponse.cards[i]);
          if (card.imageUrl) {
            // We only want to save if the card has an imageUrl we can use.
            cards.push(card);
          }
        }
      }
    }

    this.cards = cards;
  }

  get response() {
    return JSON.stringify(this.cards);
  }
}

module.exports = CardSearch;
