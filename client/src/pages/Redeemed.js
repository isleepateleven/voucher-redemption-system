import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import jsPDF from "jspdf";
import QRCode from "qrcode";
import Navbar from "../components/Navbar";
import { PiDownloadSimpleBold } from "react-icons/pi";

import { fetchRedeemedHistory } from "../services/historyService";

const Redeemed = () => {
  const { user } = useAuth();

  const [redeemed, setRedeemed] = useState([]);

  // Load redeemed voucher history for current user
  useEffect(() => {
    if (!user?.uid) return;

    const loadRedeemedHistory = async () => {
      try {
        const data = await fetchRedeemedHistory(user.uid);
        setRedeemed(data);
      } catch (err) {
        console.error("Error fetching redeemed vouchers:", err);
      }
    };

    loadRedeemedHistory();
  }, [user]);

  // Download one redeemed voucher as PDF with QR code
  const downloadVoucher = async (item) => {
    const doc = new jsPDF();
    const title = item.voucher_id?.title || "Voucher";
    const code = item.qrUnitId.slice(-8).toUpperCase();
    const date = new Date(item.completed_date).toLocaleDateString();
    const filename =
      `${title.replace(/\s+/g, "_").toLowerCase()}_redeemed_${new Date(item.completed_date).toISOString().split("T")[0]}.pdf`;

    // Generate unique QR code per redeemed unit
    const qrData = await QRCode.toDataURL(`voucher:${item.qrUnitId}`);

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
    doc.addImage(qrData, "PNG", 145, 20, 40, 40);

    doc.save(filename);
  };

  // Expand quantity so each voucher unit gets its own unique QR id
  const flattened = redeemed.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => ({
      ...item,
      quantity: 1,
      qrUnitId: `${item._id}-${index + 1}`,
    }))
  );

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#f7f7fb] px-8 py-4">
        <h2 className="mb-6 mt-2 text-xl font-bold text-[#333]">
          My Redeemed Vouchers
        </h2>

        {flattened.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-40 text-center text-[#555]">
            <p className="mb-4 text-[0.95rem]">
              You haven't redeemed any vouchers yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {flattened.map((item, idx) => (
              <div
                className="flex w-[260px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:-translate-y-0.5"
                key={`${item._id}-${idx}`}
              >
                <img
                  src={item.voucher_id?.image}
                  alt="voucher"
                  className="h-[140px] w-full object-cover"
                />

                <div className="flex flex-col gap-2 p-4">
                  <h4 className="m-0 overflow-hidden truncate whitespace-nowrap text-base font-semibold text-[#222]">
                    {item.voucher_id?.title}
                  </h4>

                  <p className="text-xs text-[#666]">
                    Redeemed on:{" "}
                    {new Date(item.completed_date).toLocaleDateString()}
                  </p>

                  <button
                    className="flex cursor-pointer items-center justify-center gap-[0.4rem] rounded-full border-none bg-[#665290] px-4 py-[0.6rem] text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#9986d0]"
                    onClick={() => downloadVoucher(item)}
                  >
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