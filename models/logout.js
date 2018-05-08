// Used to validate input from the user.
const validator = require('validator');
const crypto = require('crypto');
const config = require('../magic-brian-server-config');
const authManager = require('../auth/manager');

class Logout {
  constructor(data) {
    if (validator.isEmail(validator.escape(data.body.email))) {
      this.email = validator.escape(data.body.email);
    }
    this.auth = authManager.validate(validator.escape(data.body.auth));
    this.ipHash = crypto.createHmac(config.HASH_ALGORITHM, config.IP_SECRET)
                      .update(validator.escape(data.connection.remoteAddress))
                      .digest('hex');

    this.rawAuth = validator.escape(data.body.auth);
  }
}


module.exports = Logout;