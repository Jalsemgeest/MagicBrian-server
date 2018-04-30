const utf8 = require('utf8');

class Card {
  constructor(data) {
    Object.assign(this, data);

    let keys = Object.keys(this);
    for (let i = 0; i < keys.length; i++) {
      if (typeof(this[keys[i]]) === "string") {
        this[keys[i]] = utf8.decode(this[keys[i]]);
      }
    }
  }
}

module.exports = Card;
