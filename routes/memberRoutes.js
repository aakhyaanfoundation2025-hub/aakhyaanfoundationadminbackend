const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  createMember,
  getAllMembers,
  getSingleMember,
  deleteMember,
} = require("../controllers/memberController");

router.post(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idUpload", maxCount: 1 },
    { name: "otherUpload", maxCount: 1 },
  ]),
  createMember
);

router.get("/", getAllMembers);
router.get("/:id", getSingleMember);
router.delete("/:id", deleteMember);

module.exports = router;