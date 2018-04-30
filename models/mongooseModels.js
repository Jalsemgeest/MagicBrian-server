
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
}

module.exports = MongooseModels;
