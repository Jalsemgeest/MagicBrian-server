const config = require('../magic-brian-server-config');
const jwt = require('jsonwebtoken');

class AuthManager {
  /**
   *  This will take in a token and attempt to decode it. It will not validate whether it has expired or not.
   */
  validate(token = {}) {
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
  generate(user = {}) {
    try {
      const authToken =
          jwt.sign({ email: user.email }, config.JWT_SALT, { expiresIn: '2h', algorithm: config.JWT_ALGORITHM });
      const refreshToken =
          jwt.sign({ email: user.email }, config.JWT_SALT, { expiresIn: '60d', algorithm: config.JWT_ALGORITHM });
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
