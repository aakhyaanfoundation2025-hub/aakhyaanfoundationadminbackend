const express = require("express");
const multer = require("multer");

const {
  getPolicyDocuments,
  uploadPolicyDocument,
  deletePolicyDocument,
} = require("../controllers/policyDocumentController");

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

router.get("/", getPolicyDocuments);
router.post("/", protectAdmin, upload.single("document"), uploadPolicyDocument);
router.delete("/:id", protectAdmin, deletePolicyDocument);

module.exports = router;