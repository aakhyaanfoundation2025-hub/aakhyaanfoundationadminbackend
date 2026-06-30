const express = require("express");
const multer = require("multer");

const {
  getDocuments,
  uploadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.get("/", getDocuments);
router.post("/", protectAdmin, upload.single("document"), uploadDocument);
router.delete("/:id", protectAdmin, deleteDocument);

module.exports = router;