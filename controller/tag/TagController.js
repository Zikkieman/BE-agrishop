const {
  addTag,
  getTags,
  updateTag,
  deleteTag,
} = require("../../services/tag/TagService");

class TagClass {
  static async addTag(request, res, next) {
    try {
      return await addTag(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async updateTag(request, res, next) {
    try {
      return await updateTag(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTag(request, res, next) {
    try {
      return await deleteTag(request, res);
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
