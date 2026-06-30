const PressCoverage = require("../models/PressCoverage");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/press-coverage",
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    stream.end(fileBuffer);
  });
};

exports.getPressCoverageImages = async (req, res) => {
  try {
    const images = await PressCoverage.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch press coverage images",
      error: error.message,
    });
  }
};

exports.uploadPressCoverageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const uploadedImage = await streamUpload(req.file.buffer);

    const image = await PressCoverage.create({
      image: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });

    res.status(201).json({
      message: "Press coverage image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log("UPLOAD PRESS COVERAGE ERROR:", error);
    res.status(500).json({
      message: "Failed to upload press coverage image",
      error: error.message,
    });
  }
};

exports.deletePressCoverageImage = async (req, res) => {
  try {
    const image = await PressCoverage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Press coverage image not found" });
    }

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await image.deleteOne();

    res.status(200).json({
      message: "Press coverage image deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRESS COVERAGE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete press coverage image",
      error: error.message,
    });
  }
};