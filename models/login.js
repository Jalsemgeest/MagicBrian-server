// Used to validate input from the user.
const validator = require('validator');
const crypto = require('crypto');
const config = require('../magic-brian-server-config');

class Login {
  constructor(data) {
    this.username = validator.escape(data.body.username);
    this.password = crypto.createHmac(config.HASH_ALGORITHM, config.PASSWORD_SECRET)
                      .update(validator.escape(data.body.password))
                      .digest('hex');
    this.ipHash = crypto.createHmac(config.HASH_ALGORITHM, config.IP_SECRET)
                      .update(validator.escape(data.connection.remoteAddress))
                      .digest('hex');
  }
}


module.exports = Login;