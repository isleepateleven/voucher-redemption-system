// services/voucherService.js
import axios from "axios";
const API = "http://localhost:5001/api";

export const fetchVouchers = async () => {
  const res = await axios.get(`${API}/vouchers`);
  return res.data;
};

export const createVoucher = async (data) => {
  const res = await axios.post(`${API}/vouchers`, data);
  return res.data;
};

export const updateVoucher = async (id, data) => {
  const res = await axios.put(`${API}/vouchers/${id}`, data);
  return res.data;
};

export const deleteVoucher = async (id) => {
  const res = await axios.delete(`${API}/vouchers/${id}`);
  return res.data;
};