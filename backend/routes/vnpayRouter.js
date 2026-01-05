// ✅ ROUTER: routes/vnpayRouter.js

import express from "express";
import {
  createVNPayPayment,
  handleVNPayCallback,
  createVNPayQR,
} from "../controllers/vnpayController.js";

const vnpayRouter = express.Router();

// 📌 Route: Kiểm tra cấu hình VNPay (test endpoint)
vnpayRouter.get("/check-config", (req, res) => {
  const config = {
    hasTmnCode: !!process.env.VNPAY_TMN_CODE,
    hasHashSecret: !!process.env.VNPAY_HASH_SECRET,
    tmnCode: process.env.VNPAY_TMN_CODE
      ? `${process.env.VNPAY_TMN_CODE.substring(0, 4)}...`
      : "Missing",
    url:
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    isSandbox: (process.env.VNPAY_URL || "").includes("sandbox"),
    status:
      process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET
        ? "✅ Configured"
        : "❌ Missing config",
  };
  res.json(config);
});

// 📌 Route: Tạo yêu cầu thanh toán VNPay
vnpayRouter.post("/create-payment", createVNPayPayment);

// 📌 Route: Callback từ VNPay sau khi thanh toán
vnpayRouter.get("/callback", handleVNPayCallback);

// 📌 Route: Tạo QR code VNPay
vnpayRouter.post("/create-qr", createVNPayQR);

export default vnpayRouter;
