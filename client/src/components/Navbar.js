import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { PiShoppingCartSimpleBold, PiWalletBold, PiGearBold } from "react-icons/pi";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { userProfile } = useAuth();

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
      icon: <FaSignOutAlt />,
      command: handleLogoutConfirm,
    },
  ];

  const navIconLinkClass =
    "flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-[0.3rem]";

  const navIconClass =
    "text-[1.4rem] text-[#444] transition-colors duration-200 hover:text-[#8e7cc3] md:text-[1.3rem]";

  return (
    <nav className="w-full border-b border-[#eee] bg-white px-6 py-[0.8rem]">
      <div className="mx-auto flex w-full flex-nowrap items-center justify-between md:px-2">
        <div className="flex items-center">
          <div
            className="cursor-pointer bg-gradient-to-r from-[#3f51b5] to-[#9c27b0] bg-clip-text text-[1.4rem] font-bold text-transparent md:text-[1.2rem]"
            onClick={() => navigate("/home")}
          >
            VoucherBank
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-[0.7rem]">
          <Link to="/cart" className={navIconLinkClass}>
            <PiShoppingCartSimpleBold className={navIconClass} />
          </Link>

          <Link to="/redeemed" className={navIconLinkClass}>
            <PiWalletBold className={navIconClass} />
          </Link>

          {userProfile?.role === "admin" && (
            <Link to="/admin" className={navIconLinkClass}>
              <PiGearBold className={navIconClass} />
            </Link>
          )}

          <div
            onClick={(e) => menuRef.current.toggle(e)}
            className="cursor-pointer"
          >
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt="Profile"
                className="h-8 w-8 cursor-pointer rounded-full object-cover md:h-7 md:w-7"
              />
            ) : (
              <FaUserCircle className="cursor-pointer text-[32px] text-[#444] md:text-[28px]" />
            )}
          </div>

          <Menu model={menuItems} popup ref={menuRef} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;