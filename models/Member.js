const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    organization_name: String,

    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },

    relation: String,
    father_name: String,

    profession: String,
    blood_group: { type: String, required: true },

    state: { type: String, required: true },
    district: { type: String, required: true },

    mobile: { type: String, required: true },
    aadhaar: { type: String, required: true },

    address: { type: String, required: true },
    pincode: { type: String, required: true },
    email: String,

    document_type: String,

    profileImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    idUpload: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    otherUpload: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    declaration: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);