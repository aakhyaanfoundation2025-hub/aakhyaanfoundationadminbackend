const Document = require("../models/Document");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/documents",
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

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const uploadedPdf = await streamUpload(req.file.buffer);

    const document = await Document.create({
      name: req.file.originalname,
      file: uploadedPdf.secure_url,
      public_id: uploadedPdf.public_id,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.log("UPLOAD DOCUMENT ERROR:", error);
    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.public_id) {
      await cloudinary.uploader.destroy(document.public_id, {
        resource_type: "raw",
      });
    }

    await document.deleteOne();

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.log("DELETE DOCUMENT ERROR:", error);
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};