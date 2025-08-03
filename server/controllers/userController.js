const User = require("../models/User");

const createUser = async (req, res) => {
  const { uid, email } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, role: "user" });
      await user.save();
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create/retrieve user",
      error: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  const uid = req.user.uid; // from firebaseAuth middleware
  const { username, phoneNumber, address, profileImage } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { username, phoneNumber, address, profileImage },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", error: err.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserProfile,
};