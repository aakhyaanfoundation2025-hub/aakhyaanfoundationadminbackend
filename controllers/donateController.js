const Donate = require("../models/Donate");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

const uploadFileToCloudinary = async (file, folder) => {
  if (!file) return null;

  const uploaded = await streamUpload(file.buffer, folder);

  return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
  };
};

exports.createDonation = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      panNumber,
      address,
      donationAmount,
      documentType,
      documentNumber,
    } = req.body;

    if (
      !fullName ||
      !mobile ||
      !address ||
      !donationAmount ||
      !documentType ||
      !documentNumber
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const photo = await uploadFileToCloudinary(
      req.files?.photo?.[0],
      "aakhyaan-foundation/donations/photo"
    );

    const documentFront = await uploadFileToCloudinary(
      req.files?.documentFront?.[0],
      "aakhyaan-foundation/donations/document-front"
    );

    const documentBack = await uploadFileToCloudinary(
      req.files?.documentBack?.[0],
      "aakhyaan-foundation/donations/document-back"
    );

    const donation = await Donate.create({
      fullName,
      mobile,
      email,
      panNumber,
      address,
      donationAmount: Number(donationAmount),
      documentType,
      documentNumber,
      photo,
      documentFront,
      documentBack,
    });

    res.status(201).json({
      message: "Donation submitted successfully",
      donation,
    });
  } catch (error) {
    console.log("CREATE DONATION ERROR:", error);
    res.status(500).json({
      message: "Failed to submit donation",
      error: error.message,
    });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donate.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};

exports.getSingleDonation = async (req, res) => {
  try {
    const donation = await Donate.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donation",
      error: error.message,
    });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donate.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    const files = [
      donation.photo?.public_id,
      donation.documentFront?.public_id,
      donation.documentBack?.public_id,
    ];

    for (const publicId of files) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await donation.deleteOne();

    res.status(200).json({
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.log("DELETE DONATION ERROR:", error);
    res.status(500).json({
      message: "Failed to delete donation",
      error: error.message,
    });
  }
};