const mongoose = require("mongoose");

const donateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    panNumber: { type: String },
    address: { type: String, required: true },

    donationAmount: { type: Number, required: true },

    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },

    photo: {
      url: String,
      public_id: String,
    },

    documentFront: {
      url: String,
      public_id: String,
    },

    documentBack: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donate", donateSchema);