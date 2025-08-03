import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { PiDownloadSimpleBold } from "react-icons/pi";
import "./Redeemed.css";

const Redeemed = () => {
  const { user } = useAuth();
  const [redeemed, setRedeemed] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchRedeemed = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/history/${user.uid}/redeemed`);
        const data = await res.json();
        setRedeemed(data);
      } catch (err) {
        console.error("Error fetching redeemed vouchers:", err);
      }
    };

    fetchRedeemed();
  }, [user]);

  const downloadVoucher = async (item) => {
    const doc = new jsPDF();
    const title = item.voucher_id?.title || "Voucher";
    const code = item._id.slice(-8).toUpperCase();
    const date = new Date(item.completed_date).toLocaleDateString();
    const filename =
      `${title.replace(/\s+/g, "_").toLowerCase()}_redeemed_${new Date(item.completed_date).toISOString().split("T")[0]}.pdf`;

    // Generate QR code (can be changed to a full redemption URL if needed)
    const qrData = await QRCode.toDataURL(`voucher:${item._id}`);

    // Draw content
    doc.setFontSize(16);
    doc.text(title, 20, 30);

    doc.setFontSize(12);
    doc.text(`Voucher Code: ${code}`, 20, 45);
    doc.text(`Redeemed Date: ${date}`, 20, 55);
    doc.text("Terms and Conditions:", 20, 70);

    const terms = item.voucher_id?.terms_and_conditions || "N/A";
    const wrappedText = doc.splitTextToSize(terms, 170);
    doc.text(wrappedText, 20, 80);

    // Add QR code to right side
    doc.addImage(qrData, "PNG", 145, 20, 40, 40);

    doc.save(filename);
  };

  // Flatten based on quantity
  const flattened = redeemed.flatMap(item =>
    Array(item.quantity).fill({ ...item, quantity: 1 })
  );

  return (
    <>
      <Navbar />
      <div className="redeemed-page">
        <h2 className="redeemed-title">My Redeemed Vouchers</h2>

        {flattened.length === 0 ? (
          <div className="redeemed-empty">
            <p>You haven't redeemed any vouchers yet.</p>
          </div>
        ) : (
          <div className="redeemed-list">
            {flattened.map((item, idx) => (
              <div className="redeemed-card" key={`${item._id}-${idx}`}>
                <img
                  src={item.voucher_id?.image}
                  alt="voucher"
                  className="redeemed-image"
                />
                <div className="redeemed-details">
                  <h4>{item.voucher_id?.title}</h4>
                  <p className="redeemed-date">
                    Redeemed on: {new Date(item.completed_date).toLocaleDateString()}
                  </p>
                  <button className="download-button" onClick={() => downloadVoucher(item)}>
                    DOWNLOAD <PiDownloadSimpleBold size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Redeemed;