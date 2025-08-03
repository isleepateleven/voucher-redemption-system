import React from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteVoucher } from "../services/voucherService";
import { useToast } from "../context/ToastContext";
import "./AdminVoucherCard.css";
import "primereact/resources/themes/lara-light-purple/theme.css";

const AdminVoucherCard = ({ voucher, onEdit, onDeleted }) => {
  const { showToast } = useToast();

  const confirmDelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete "${voucher.title}"?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      accept: async () => {
        try {
          await deleteVoucher(voucher._id);
          showToast({ severity: "success", summary: "Deleted", detail: "Voucher deleted." });
          onDeleted();
        } catch {
          showToast({ severity: "error", summary: "Failed", detail: "Failed to delete voucher." });
        }
      },
    });
  };

  return (
    <div className="admin-voucher-card">
      <img src={voucher.image} alt={voucher.title} className="voucher-image" />
      <div className="voucher-info">
        <h4>{voucher.title}</h4>
        <p>{voucher.description}</p>
        {/* <p><strong>Points:</strong> {voucher.points}</p> */}
      </div>
      <div className="voucher-buttons">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={confirmDelete}>Delete</button>
      </div>
    </div>
  );
};

export default AdminVoucherCard;