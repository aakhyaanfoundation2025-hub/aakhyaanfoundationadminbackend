const express = require("express");

const {
  getPressCoverageImages,
  uploadPressCoverageImage,
  deletePressCoverageImage,
} = require("../controllers/pressCoverageController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getPressCoverageImages);
router.post("/", protectAdmin, upload.single("image"), uploadPressCoverageImage);
router.delete("/:id", protectAdmin, deletePressCoverageImage);

module.exports = router;