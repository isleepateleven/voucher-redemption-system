import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "../../context/ToastContext";
import { getAllUsers } from "../../services/userService";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users", err);
      showToast({ severity: "error", summary: "Error", detail: "Failed to load users." });
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="user-management">
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;