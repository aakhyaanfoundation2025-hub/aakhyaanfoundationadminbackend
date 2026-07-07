const Member = require("../models/Member");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
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

exports.createMember = async (req, res) => {
  try {
    const {
      organization_name,
      name,
      gender,
      dob,
      relation,
      father_name,
      profession,
      blood_group,
      state,
      district,
      mobile,
      aadhaar,
      address,
      pincode,
      email,
      document_type,
      declaration,
    } = req.body;

    if (
      !name ||
      !gender ||
      !dob ||
      !blood_group ||
      !state ||
      !district ||
      !mobile ||
      !aadhaar ||
      !address ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const profileImage = await uploadFileToCloudinary(
      req.files?.profileImage?.[0],
      "aakhyaan-foundation/members/profile"
    );

    const idUpload = await uploadFileToCloudinary(
      req.files?.idUpload?.[0],
      "aakhyaan-foundation/members/id-proof"
    );

    const otherUpload = await uploadFileToCloudinary(
      req.files?.otherUpload?.[0],
      "aakhyaan-foundation/members/other-documents"
    );

    const member = await Member.create({
      organization_name,
      name,
      gender,
      dob,
      relation,
      father_name,
      profession,
      blood_group,
      state,
      district,
      mobile,
      aadhaar,
      address,
      pincode,
      email,
      document_type,
      declaration: declaration === "on" || declaration === "true",
      profileImage,
      idUpload,
      otherUpload,
    });

    res.status(201).json({
      message: "Membership form submitted successfully",
      member,
    });
  } catch (error) {
    console.log("CREATE MEMBER ERROR:", error);
    res.status(500).json({
      message: "Failed to submit membership form",
      error: error.message,
    });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: members.length,
      members,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};

exports.getSingleMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch member",
      error: error.message,
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const files = [
      member.profileImage?.public_id,
      member.idUpload?.public_id,
      member.otherUpload?.public_id,
    ];

    for (const publicId of files) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await member.deleteOne();

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.log("DELETE MEMBER ERROR:", error);
    res.status(500).json({
      message: "Failed to delete member",
      error: error.message,
    });
  }
};