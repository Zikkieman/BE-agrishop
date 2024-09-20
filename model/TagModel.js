const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag: {
      name: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.models.Tag ?? mongoose.model("tag", tagSchema);
module.exports = Tag;
