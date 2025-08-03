import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5001/api" });

export const redeemCart = (user_id) => API.post("/cart/redeem", { user_id });
export const fetchRedeemed = (user_id) => API.get(`/history/${user_id}`);