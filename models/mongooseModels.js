
const schemas = {};

class MongooseModels {
  /**
   *  This will return the mongoose model used for the card collection.
   *  @param mongoose This is an instance of the mongoose connection.
   */
  card(mongoose) {
    if (!schemas["card"]) {
      schemas["card"] = mongoose.model('Card', {
                          name: String,
                          manaCost: String,
                          cmc: Number,
                          colors: [String],
                          colorIdentity: [String],
                          type: String,
                          supertypes: [String],
                          types: [String],
                          subtypes: [String],
                          rarity: String,
                          "set": String,
                          setName: String,
                          text: String,
                          artist: String,
                          number: String,
                          power: String,
                          toughness: String,
                          layout: String,
                          multiverseid: Number,
                          imageUrl: String,
                          rulings: [{ date: String, text: String }],
                          foreignNames: [{ name: String, imageUrl: String, language: String, multiverseid: Number }],
                          printings: [String],
                          originalText: String,
                          originalType: String,
                          legalities: [{ format: String, legality: String }],
                          id: String,
                        });
    }
    return schemas["card"];
  }

  /**
   *  This will return the mongoose model for the user collection.
   *  @param mongoose This is an instance of the mongoose connection.
   */
  user(mongoose) {
    if (!schemas["user"]) {
      schemas["user"] = mongoose.model('User', {
        id: String,
        email: String,
        passwordHash: String,
        createdDate: Date,
        lastLogin: Date,
      })
    }
    return schemas["user"];
  }

  /**
   *  This will return the mongoose model for the auth collection.
   *  @param mongoose This is an instance of the mongoose connection.
   */
  auth(mongoose) {
    if (!schemas["auth"]) {
      schemas["auth"] = mongoose.model('Auth', {
        id: String,
        userId: String,
        ipHash: String,
        auth: String,
        refreshToken: String,
        generated: Date,
        lastUsed: Date,
      })
    }
    return schemas["auth"];
  }
}

module.exports = MongooseModels;
