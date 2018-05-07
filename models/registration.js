// Used to validate input from the user.
const validator = require('validator');
const crypto = require('crypto');
const config = require('../magic-brian-server-config');

class Registration {
  constructor(data) {
    if (validator.isEmail(validator.escape(data.body.email))) {
      this.email = validator.escape(data.body.email);
    }
    this.password = crypto.createHmac(config.HASH_ALGORITHM, config.PASSWORD_SECRET)
                      .update(validator.escape(data.body.password))
                      .digest('hex');
    this.ipHash = crypto.createHmac(config.HASH_ALGORITHM, config.IP_SECRET)
                      .update(validator.escape(data.connection.remoteAddress))
                      .digest('hex');
  }
}


module.exports = Registration;