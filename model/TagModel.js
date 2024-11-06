const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

tagSchema.index({ tag: 1 }, { unique: true });

tagSchema.pre("findOneAndDelete", async function (next) {
  const tagId = this.getQuery()._id;
  await mongoose
    .model("Product")
    .updateMany({ "tag._id": tagId }, { $pull: { tag: { _id: tagId } } });
  next();
});

tagSchema.pre("findOneAndUpdate", async function (next) {
  const tagId = this.getQuery()._id;
  const update = this.getUpdate();
  const newTag = update.tag;

  if (newTag) {
    await mongoose
      .model("Product")
      .updateMany({ "tag._id": tagId }, { $set: { "tag.$.tag": newTag } });
  }

  next();
});

const Tag = mongoose.models.Tag ?? mongoose.model("Tag", tagSchema);
module.exports = Tag;
