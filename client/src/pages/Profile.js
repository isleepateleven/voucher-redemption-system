import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import "./Profile.css";

const Profile = () => {
  const { userProfile, setUserProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        email: userProfile.email,
        profileImage: userProfile.profileImage || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      showToast({
        severity: "warn",
        summary: "Unsupported Format",
        detail: "Only JPG, JPEG, and PNG are allowed.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(userProfile.uid, formData);
      setUserProfile(updated);
      showToast({ severity: "success", summary: "Success", detail: "Profile updated." });
    } catch (error) {
      showToast({ severity: "error", summary: "Error", detail: "Failed to update profile." });
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <h2 className="profile-title">Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-avatar-wrapper">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <FaUserCircle className="profile-avatar-icon" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </div>

          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            className="profile-input"
            disabled
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            className="profile-input"
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            className="profile-input"
            onChange={handleChange}
          />

          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            className="profile-textarea"
            onChange={handleChange}
          />

          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </>
  );
};

export default Profile;