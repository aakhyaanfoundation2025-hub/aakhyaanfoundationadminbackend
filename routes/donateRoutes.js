const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  createDonation,
  getAllDonations,
  getSingleDonation,
  deleteDonation,
} = require("../controllers/donateController");

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
  ]),
  createDonation
);

router.get("/", getAllDonations);
router.get("/:id", getSingleDonation);
router.delete("/:id", deleteDonation);

module.exports = router;