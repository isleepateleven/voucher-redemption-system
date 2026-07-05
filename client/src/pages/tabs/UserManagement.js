import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "../../context/ToastContext";

import { getAllUsers } from "../../services/userService";

const UserManagement = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users", err);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Failed to load users.",
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="py-4">
      <div className="overflow-hidden border border-[#ece7f6] bg-white shadow-sm">
        <table className="w-full border-collapse text-[0.875rem]">
         <thead>
            <tr className="bg-[#5e4596]">
              <th className="border-b border-[#755cb3] px-4 py-3 text-left text-[0.82rem] font-semibold text-white">
                Email
              </th>
              <th className="border-b border-[#755cb3] px-4 py-3 text-left text-[0.82rem] font-semibold text-white">
                Role
              </th>
              <th className="border-b border-[#755cb3] px-4 py-3 text-left text-[0.82rem] font-semibold text-white">
                Created At
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u._id}
                className="transition-colors duration-150 hover:bg-[#faf7ff]"
              >
                <td
                  className={`px-4 py-3 text-[#333] ${
                    index !== users.length - 1
                      ? "border-b border-[#ece7f6]"
                      : ""
                  }`}
                >
                  {u.email}
                </td>

                <td
                  className={`px-4 py-3 capitalize text-[#333] ${
                    index !== users.length - 1
                      ? "border-b border-[#ece7f6]"
                      : ""
                  }`}
                >
                  {u.role}
                </td>

                <td
                  className={`px-4 py-3 text-[#333] ${
                    index !== users.length - 1
                      ? "border-b border-[#ece7f6]"
                      : ""
                  }`}
                >
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;