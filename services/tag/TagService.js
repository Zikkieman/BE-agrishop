const Product = require("../../model/ProductModel");
const Tag = require("../../model/TagModel");

const addTag = async (req, res) => {
  const { tag } = req.body;

  try {
    const newTag = new Tag({ tag });

    await newTag.save();

    res.status(201).json(newTag);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Tag already exists" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const updateTag = async (req, res) => {
  const { id, tag } = req.body;

  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { tag },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await Product.updateMany(
      { "tag._id": id },
      { $pull: { tag: { _id: id } } }
    );

    res.status(200).json({ message: "Tag deleted and removed from products" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addTag, updateTag, deleteTag, getTags };
