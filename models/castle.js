var mongoose = require("mongoose");

var castleSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    price: String,
    description: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Castle", castleSchema);
