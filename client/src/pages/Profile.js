import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import Navbar from "../components/Navbar";

import { updateUserProfile } from "../services/userService";

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

  // Load user profile into form when page loads or userProfile changes
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

  // Handle input changes (username, phone, address)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and convert to base64 for preview
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

  // Submit updated profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(formData);

      setUserProfile(updated);

      showToast({
        severity: "success",
        summary: "Success",
        detail: "Profile updated.",
      });
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Failed to update profile.",
      });
    }
  };

  const labelClass = "mt-2 mb-1 text-[0.85rem] font-semibold text-[#444]";
  const inputClass =
    "mb-[0.35rem] w-full rounded-md border border-[#ccc] px-3 py-[0.6rem] text-[0.85rem] font-sans";

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-start bg-[#f7f7fb] px-8 py-4 font-sans">
        <h2 className="mb-6 mt-2 text-xl font-bold text-[#333]">Profile</h2>

        <form
          className="flex w-full max-w-[680px] flex-col rounded-xl bg-white p-8 text-[0.85rem] shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex flex-col items-center">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="mb-3 h-[100px] w-[100px] rounded-full border-2 border-[#ccc] object-cover"
              />
            ) : (
              <FaUserCircle className="text-[100px] text-[#ccc]" />
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
              className="mb-1 block text-center text-[0.85rem] file:mb-2 file:cursor-pointer file:rounded-md file:border file:border-[#ccc] file:bg-[#eee] file:px-3 file:py-[0.3rem] file:transition-colors hover:file:bg-[#ddd]"
            />
          </div>

          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={formData.email}
            className={`${inputClass} bg-[#f0f0f0] text-[#888]`}
            disabled
          />

          <label className={labelClass}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            className={inputClass}
            onChange={handleChange}
          />

          <label className={labelClass}>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            className={inputClass}
            onChange={handleChange}
          />

          <label className={labelClass}>Address</label>
          <textarea
            name="address"
            value={formData.address}
            className={`${inputClass} min-h-[80px] resize-y`}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="mt-6 self-end rounded-full border-none bg-[#5e4596] px-6 py-2 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[#7e6bcf]"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;