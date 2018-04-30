const utf8 = require('utf8');

class Card {
  constructor(data) {
    console.log('Card constructor');
    Object.assign(this, data);

    console.log('Creating it...');
    let keys = Object.keys(this);
    for (let i = 0; i < keys.length; i++) {
      if (typeof(this[keys[i]]) === "string") {
        this[keys[i]] = utf8.decode(this[keys[i]]);
      }
    }

    console.log('Creating the card:');
    console.log(this);
  }
}

module.exports = Card;
