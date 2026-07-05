import React from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../context/ToastContext";

import { deleteVoucher } from "../services/voucherService";
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

          showToast({
            severity: "success",
            summary: "Deleted",
            detail: "Voucher deleted.",
          });

          onDeleted();
        } catch {
          showToast({
            severity: "error",
            summary: "Failed",
            detail: "Failed to delete voucher.",
          });
        }
      },
    });
  };

  const buttonBaseClass =
    "min-w-[100px] flex-1 rounded-full border-none px-3 py-[0.6rem] text-center text-xs font-semibold transition-all duration-200";

  return (
    <div
      className="m-2 flex h-[270px] w-[260px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-1"
    >
      <img
        src={voucher.image}
        alt={voucher.title}
        className="h-[140px] w-full object-cover"
      />

      <div className="box-border flex max-w-full flex-1 flex-col px-4 py-3">
        <h4 className="my-[0.2rem] line-clamp-1 max-w-full break-words text-[16px] font-semibold leading-[1.2] text-[#222]">
          {voucher.title}
        </h4>

        <p className="line-clamp-2 max-w-full overflow-hidden text-xs leading-[1.2] text-[#666]">
          {voucher.description}
        </p>

        <div className="mt-auto flex gap-3">
          <button
            className={`${buttonBaseClass} cursor-pointer bg-[#f1f1f1] text-[#333] hover:-translate-y-px hover:bg-[#e0e0e0]`}
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className={`${buttonBaseClass} cursor-pointer bg-[#c1383a] text-white hover:-translate-y-px hover:bg-[#ee4c4f]`}
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherCard;