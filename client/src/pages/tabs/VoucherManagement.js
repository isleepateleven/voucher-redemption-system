import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "../../context/ToastContext";

import AdminVoucherCard from "../../components/AdminVoucherCard";
import VoucherForm from "../../components/VoucherForm";

import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
} from "../../services/voucherService";

const VoucherManagement = () => {
  const { showToast } = useToast();

  const [vouchers, setVouchers] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load all vouchers
  // useCallback keeps a function stable across renders to prevent unnecessary re-runs
  const loadVouchers = useCallback(async () => {
    try {
      const data = await getAllVouchers();
      setVouchers(data);
    } catch (err) {
      console.error("Error fetching vouchers", err);
      setVouchers([]);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Failed to load vouchers.",
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Open form for new voucher
  const handleAdd = () => {
    setEditingVoucher(null);
    setShowForm(true);
  };

  // Open form for editing voucher
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setShowForm(true);
  };

  // Close form
  const handleCancel = () => {
    setEditingVoucher(null);
    setShowForm(false);
  };

  // Save new or edited voucher
  const handleSave = async (formData) => {
    try {
      if (editingVoucher) {
        await updateVoucher(editingVoucher._id, formData);
        showToast({
          severity: "success",
          summary: "Updated",
          detail: "Voucher updated.",
        });
      } else {
        await createVoucher(formData);
        showToast({
          severity: "success",
          summary: "Created",
          detail: "Voucher added.",
        });
      }

      handleCancel();
      loadVouchers();
    } catch (err) {
      console.error(err);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Could not save.",
      });
    }
  };

  return (
    <div>
      <div className="mt-4 mb-2 flex items-center justify-between">
       <button
        className="rounded-full bg-[#5e4596] px-5 py-3 text-[0.75rem] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#7e6bcf]"
        onClick={handleAdd}
      >
        + Add Voucher
      </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {vouchers.map((v) => (
          <AdminVoucherCard
            key={v._id}
            voucher={v}
            onEdit={() => handleEdit(v)}
            onDeleted={loadVouchers}
          />
        ))}
      </div>

      {showForm && (
        <VoucherForm
          initialData={editingVoucher}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default VoucherManagement;