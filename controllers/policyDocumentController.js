const PolicyDocument = require("../models/PolicyDocument");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/policy-documents",
        resource_type: "raw",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    stream.end(fileBuffer);
  });
};

exports.getPolicyDocuments = async (req, res) => {
  try {
    const documents = await PolicyDocument.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Policy documents fetch failed",
      error: error.message,
    });
  }
};

exports.uploadPolicyDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const uploadedPdf = await streamUpload(req.file.buffer);

    const document = await PolicyDocument.create({
      name: req.file.originalname,
      file: uploadedPdf.secure_url,
      public_id: uploadedPdf.public_id,
    });

    res.status(201).json({
      message: "Policy document uploaded successfully",
      document,
    });
  } catch (error) {
    console.log("UPLOAD POLICY DOCUMENT ERROR:", error);

    res.status(500).json({
      message: "Policy document upload failed",
      error: error.message,
    });
  }
};

exports.deletePolicyDocument = async (req, res) => {
  try {
    const document = await PolicyDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Policy document not found" });
    }

    if (document.public_id) {
      await cloudinary.uploader.destroy(document.public_id, {
        resource_type: "raw",
      });
    }

    await document.deleteOne();

    res.status(200).json({
      message: "Policy document deleted successfully",
    });
  } catch (error) {
    console.log("DELETE POLICY DOCUMENT ERROR:", error);

    res.status(500).json({
      message: "Policy document delete failed",
      error: error.message,
    });
  }
};