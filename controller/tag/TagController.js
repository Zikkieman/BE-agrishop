const { addTag, getTags } = require("../../services/tag/TagService");

class TagClass {
  static async addTag(request, res, next) {
    console.log("YEs");
    try {
      return await addTag(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async getTags(req, res, next) {
    try {
      return await getTags(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TagClass;
