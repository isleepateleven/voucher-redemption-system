import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import {
  PiSignOut,
  PiShoppingCartSimpleBold,
  PiWalletBold,
  PiGearBold,
} from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { user, userProfile } = useAuth();

  const handleLogoutConfirm = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Confirm Logout",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
      accept: () => {
        localStorage.removeItem("token");
        navigate("/");
      },
    });
  };

  const menuItems = [
    {
      label: "Profile",
      icon: <FaUserCircle />,
      command: () => navigate("/profile"),
    },
    {
      label: "Logout",
      icon: <PiSignOut />,
      command: handleLogoutConfirm,
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-brand" onClick={() => navigate("/home")}>
            VoucherBank
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/cart" className="navbar-cart">
            <PiShoppingCartSimpleBold className="cart-icon" />
          </Link>

          <Link to="/redeemed" className="navbar-wallet">
            <PiWalletBold className="wallet-icon" />
          </Link>

          {userProfile?.role === "admin" && (
            <Link to="/admin" className="navbar-admin">
              <PiGearBold className="admin-icon" />
            </Link>
          )}

          <div
            onClick={(e) => menuRef.current.toggle(e)}
            className="navbar-avatar-wrapper"
          >
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt="Profile"
                className="navbar-avatar"
              />
            ) : (
              <FaUserCircle className="navbar-avatar-icon" />
            )}
          </div>

          <Menu model={menuItems} popup ref={menuRef} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;