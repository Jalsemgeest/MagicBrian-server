const config = require('../magic-brian-server-config');
const jwt = require('jsonwebtoken');

class AuthManager {
  /**
   *  This will take in a token and attempt to decode it. It will not validate whether it has expired or not.
   */
  static validate(token = {}) {
    try {
      const decoded = jwt.verify(token, config.JWT_SALT, { algorithm: config.JWT_ALGORITHM });
      return decoded;
    } catch(err) {
      if (err && err.name === 'TokenExpiredError') {
        return { error: err, message: 'Token has expired' };
      }
      return { error: err, message: 'Invalid salt.' };
    }
  }

  /**
   *  This will take in a user object and generate a auth token and a refresh token to send down to the user.
   */
  static generate(user = {}) {
    try {
      const authToken =
          jwt.sign(user, config.JWT_SALT, { expiresIn: '1d'});
      const refreshToken =
          jwt.sign(user, config.JWT_SALT, { expiresIn: '60d' });
      return {
        auth: authToken,
        refresh: refreshToken,
      };
    } catch(err) {
      return { error: err, message: 'Failed to generate user auth token.' };
    }
  }
}

module.exports = AuthManager;
