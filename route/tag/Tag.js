const express = require("express");
const TagClass = require("../../controller/tag/TagController");
const router = express.Router();

router.post("/add-tag", TagClass.addTag);
router.get("/get-tags", TagClass.getTags);
router.put("/update-tag/:id", TagClass.updateTag);
router.delete("/delete-tag/:id", TagClass.deleteTag);
module.exports = router;
