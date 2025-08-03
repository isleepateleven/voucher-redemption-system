import React, { useEffect, useState } from "react";
import {
  fetchVouchers,
  createVoucher,
  updateVoucher,
} from "../../services/voucherService";
import AdminVoucherCard from "../../components/AdminVoucherCard";
import VoucherForm from "../../components/VoucherForm";
import { useToast } from "../../context/ToastContext";
import "./VoucherManagement.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data = await fetchVouchers();
      setVouchers(data);
    } catch (err) {
      console.error("Error fetching vouchers", err);
      setVouchers([]);
    }
  };

  const handleAdd = () => {
    setEditingVoucher(null);
    setShowForm(true);
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingVoucher(null);
    setShowForm(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editingVoucher) {
        await updateVoucher(editingVoucher._id, formData);
        showToast({ severity: "success", summary: "Updated", detail: "Voucher updated." });
      } else {
        await createVoucher(formData);
        showToast({ severity: "success", summary: "Created", detail: "Voucher added." });
      }
      handleCancel();
      loadVouchers();
    } catch (err) {
      console.error(err);
      showToast({ severity: "error", summary: "Error", detail: "Could not save." });
    }
  };

  return (
    <div className="voucher-management">
      <div className="voucher-header">
        <button className="add-btn" onClick={handleAdd}>+ Add Voucher</button>
      </div>

      <div className="voucher-grid">
        {vouchers.map((v) => (
          <AdminVoucherCard key={v._id} voucher={v} onEdit={() => handleEdit(v)} onDeleted={loadVouchers} />
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