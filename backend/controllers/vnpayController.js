// ✅ CONTROLLER: controllers/vnpayController.js

import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
dotenv.config();

// Hàm sortObject theo chuẩn VNPay (sắp xếp keys, encode values và thay %20 bằng +)
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  // Lấy tất cả keys và sắp xếp (không encode keys)
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key);
    }
  }
  str.sort();
  // Tạo object mới với keys gốc đã sắp xếp, values đã encode và thay %20 bằng +
  for (key = 0; key < str.length; key++) {
    const originalKey = str[key];
    const value = obj[originalKey];
    // Chuyển đổi value thành string, encode và thay %20 bằng +
    const encodedValue = encodeURIComponent(String(value)).replace(/%20/g, "+");
    sorted[originalKey] = encodedValue;
  }
  return sorted;
}

// 📌 Tạo yêu cầu thanh toán VNPay
export const createVNPayPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl } = req.body;

    // Validate và parse amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        resultCode: 1,
        message: "Số tiền không hợp lệ",
        error: "Amount must be a positive number",
      });
    }

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url =
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl = redirectUrl || process.env.VNPAY_RETURN_URL;

    // Format ngày tháng theo VNPay: YYYYMMDDHHmmss (14 ký tự)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const createDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

    // Xử lý IP address - VNPay không chấp nhận IPv6 localhost (::1)
    let ipAddr = req.ip || req.connection.remoteAddress || "127.0.0.1";
    if (ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1") {
      ipAddr = "127.0.0.1";
    }
    // Loại bỏ IPv6 prefix nếu có
    if (ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    const orderType = "billpayment";
    const locale = "vn";
    const currCode = "VND";
    let vnp_Params = {};

    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Amount"] = Math.round(parsedAmount * 100); // Đảm bảo là số nguyên
    vnp_Params["vnp_CurrCode"] = currCode;
    // Không thêm vnp_BankCode nếu rỗng (theo chuẩn VNPay)
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo || `Thanh toan don hang ${orderId}`;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    // Sắp xếp và tạo chữ ký theo chuẩn VNPay
    vnp_Params = sortObject(vnp_Params);

    // Tạo chuỗi hash data bằng querystring.stringify với encode: false
    const signData = querystring.stringify(vnp_Params, { encode: false });

    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${vnp_Url}?${Object.keys(vnp_Params)
      .map((key) => {
        return `${key}=${encodeURIComponent(vnp_Params[key])}`;
      })
      .join("&")}`;

    res.json({
      resultCode: 0,
      message: "Tạo thanh toán VNPay thành công",
      payUrl: paymentUrl,
      orderId: orderId,
    });
  } catch (err) {
    console.error("VNPay error:", err);
    res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán VNPay", error: err.message });
  }
};

// 📌 Xử lý callback từ VNPay
export const handleVNPayCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa vnp_SecureHash và vnp_SecureHashType khỏi params
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((result, key) => {
        result[key] = vnp_Params[key];
        return result;
      }, {});

    // Tạo chuỗi hash data
    const signData = Object.keys(sortedParams)
      .map((key) => {
        return `${key}=${sortedParams[key]}`;
      })
      .join("&");

    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET);
    const signed = hmac
      .update(new Buffer.from(signData, "utf-8"))
      .digest("hex");

    // Kiểm tra chữ ký
    if (secureHash === signed) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const rspCode = vnp_Params["vnp_ResponseCode"];
      const amount = vnp_Params["vnp_Amount"] / 100; // Chia 100 để lấy số tiền thực
      const transId = vnp_Params["vnp_TransactionNo"];

      if (rspCode === "00") {
        console.log(`✅ Thanh toán VNPay thành công cho đơn ${orderId}`);

        try {
          // Import Order model
          const Order = (await import("../models/orderModel.js")).default;

          // Cập nhật trạng thái đơn hàng
          const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            {
              status: "paid",
              paymentMethod: "vnpay",
              paymentId: transId,
              paidAt: new Date(),
            },
            { new: true }
          );

          if (updatedOrder) {
            console.log(`✅ Đã cập nhật đơn hàng ${orderId} thành công`);
          } else {
            console.warn(`⚠️ Không tìm thấy đơn hàng ${orderId} để cập nhật`);
          }
        } catch (dbError) {
          console.error("❌ Lỗi cập nhật database:", dbError);
        }

        // Redirect về trang thành công
        res.redirect(
          `${process.env.FRONTEND_URL}/payment-success?resultCode=0&orderId=${orderId}&transId=${transId}&message=Thanh toán thành công`
        );
      } else {
        console.warn(
          `⚠️ Giao dịch VNPay thất bại đơn ${orderId} - Code: ${rspCode}`
        );
        res.redirect(
          `${process.env.FRONTEND_URL}/payment-success?resultCode=${rspCode}&orderId=${orderId}&message=Thanh toán thất bại`
        );
      }
    } else {
      console.error("❌ Sai chữ ký VNPay");
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-success?resultCode=99&message=Sai chữ ký`
      );
    }
  } catch (err) {
    console.error("VNPay callback error:", err);
    res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?resultCode=99&message=Lỗi xử lý callback`
    );
  }
};

// 📌 Tạo QR code VNPay
export const createVNPayQR = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl } = req.body;

    // Validate và parse amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        resultCode: 1,
        message: "Số tiền không hợp lệ",
        error: "Amount must be a positive number",
      });
    }

    // Kiểm tra environment variables
    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url =
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl = redirectUrl || process.env.VNPAY_RETURN_URL;

    // Log để debug
    console.log("🔍 VNPay Environment Variables Check:");
    console.log(
      "VNPAY_TMN_CODE:",
      vnp_TmnCode
        ? `✅ Set (${vnp_TmnCode})`
        : "❌ Missing - Cần đăng ký merchant test!"
    );
    console.log(
      "VNPAY_HASH_SECRET:",
      vnp_HashSecret ? "✅ Set" : "❌ Missing - Cần đăng ký merchant test!"
    );
    console.log(
      "VNPAY_URL:",
      vnp_Url,
      vnp_Url.includes("sandbox") ? "⚠️ SANDBOX MODE" : "✅ PRODUCTION MODE"
    );

    if (!vnp_TmnCode || !vnp_HashSecret) {
      console.error("❌ THIẾU THÔNG TIN MERCHANT!");
      console.error("📝 Hướng dẫn đăng ký merchant test:");
      console.error("   1. Truy cập: https://sandbox.vnpayment.vn/devreg/");
      console.error("   2. Điền thông tin đăng ký");
      console.error("   3. Nhận VNPAY_TMN_CODE và VNPAY_HASH_SECRET");
      console.error("   4. Thêm vào file .env:");
      console.error("      VNPAY_TMN_CODE=your_tmn_code");
      console.error("      VNPAY_HASH_SECRET=your_hash_secret");
    }

    if (!vnp_TmnCode || !vnp_HashSecret) {
      console.error("❌ Missing VNPay environment variables");
      return res.status(500).json({
        message: "Cấu hình VNPay chưa hoàn chỉnh",
        error: "Missing environment variables",
        details: {
          tmnCode: !!vnp_TmnCode,
          hashSecret: !!vnp_HashSecret,
        },
      });
    }

    // Format ngày tháng theo VNPay: YYYYMMDDHHmmss (14 ký tự)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const createDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

    // Xử lý IP address - VNPay không chấp nhận IPv6 localhost (::1)
    let ipAddr = req.ip || req.connection.remoteAddress || "127.0.0.1";
    if (ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1") {
      ipAddr = "127.0.0.1";
    }
    // Loại bỏ IPv6 prefix nếu có
    if (ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Amount"] = Math.round(parsedAmount * 100); // Đảm bảo là số nguyên
    vnp_Params["vnp_CurrCode"] = "VND";
    // Không thêm vnp_BankCode nếu rỗng (theo chuẩn VNPay)
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo || `Thanh toan don hang ${orderId}`;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_IpAddr"] = ipAddr;

    // Sắp xếp và tạo chữ ký theo chuẩn VNPay
    vnp_Params = sortObject(vnp_Params);

    // Tạo signData bằng querystring.stringify với encode: false (theo chuẩn VNPay)
    const signData = querystring.stringify(vnp_Params, { encode: false });

    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Tạo URL thanh toán VNPay (theo chuẩn VNPay)
    const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params, {
      encode: false,
    })}`;

    // Tạo QR code string cho VNPay
    // LUÔN dùng paymentUrl trực tiếp (không dùng deep link)
    // Deep link chỉ dùng để mở app VNPay, không dùng cho QR code
    const qrString = paymentUrl;
    const deepLink = `vnpay://pay?url=${encodeURIComponent(paymentUrl)}`;

    // Log để debug
    console.log("🔍 VNPay QR Debug:");
    console.log(
      "CreateDate format:",
      createDate,
      "(phải là 14 ký tự: YYYYMMDDHHmmss)"
    );
    console.log("IP Address:", ipAddr);
    console.log("Payment URL length:", paymentUrl.length);
    console.log("Payment URL (first 100 chars):", paymentUrl.substring(0, 100));
    console.log("Merchant Code trong URL:", vnp_TmnCode);
    console.log(
      "⚠️ LƯU Ý: QR code LUÔN dùng paymentUrl trực tiếp (không dùng deep link)"
    );

    try {
      // Tạo QR code base64 - LUÔN dùng paymentUrl
      const QRCode = await import("qrcode");
      console.log("✅ Đang tạo QR code từ paymentUrl...");

      // Sử dụng error correction level cao hơn (H) để xử lý URL dài tốt hơn
      // và tăng margin để dễ quét hơn
      const qrCodeBase64 = await QRCode.toDataURL(paymentUrl, {
        errorCorrectionLevel: "H", // High - để xử lý URL dài tốt hơn
        type: "image/png",
        quality: 1.0,
        margin: 2, // Tăng margin để dễ quét hơn
        width: 512, // Tăng kích thước để chứa nhiều dữ liệu hơn
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Lấy base64 string từ data URL
      const base64String = qrCodeBase64.split(",")[1];
      console.log("✅ QR code đã được tạo thành công từ paymentUrl");
      console.log("QR code base64 length:", base64String.length);

      // Deep link đã được tạo ở trên

      console.log("📤 Trả về response với:");
      console.log("- qrString:", qrString.substring(0, 100) + "...");
      console.log("- paymentUrl:", paymentUrl.substring(0, 100) + "...");
      console.log(
        "⚠️ LƯU Ý: QR code chứa URL dài, một số app có thể không quét được"
      );
      console.log(
        "💡 Giải pháp: Quét bằng App VNPay hoặc mở paymentUrl trực tiếp"
      );

      res.json({
        resultCode: 0,
        message: "Tạo QR VNPay thành công",
        qrCode: base64String,
        orderId: orderId,
        amount: amount,
        qrString: paymentUrl, // LUÔN là paymentUrl (không phải deep link)
        paymentUrl: paymentUrl,
        deepLink: deepLink, // Deep link để mở app VNPay (nếu cần)
        // Thông tin debug
        debug: {
          urlLength: paymentUrl.length,
          merchantCode: vnp_TmnCode,
          format: "URL trực tiếp (paymentUrl)",
        },
      });
    } catch (qrError) {
      console.error("❌ Lỗi tạo QR code:", qrError);
      // Fallback: trả về QR string thay vì base64
      res.json({
        resultCode: 0,
        message: "Tạo QR VNPay thành công (string only)",
        qrString: qrString,
        orderId: orderId,
        amount: amount,
        paymentUrl: paymentUrl,
        error: "QR image generation failed, using string only",
      });
    }
  } catch (err) {
    console.error("❌ VNPay QR error:", err);
    res.status(500).json({
      message: "Lỗi tạo QR VNPay",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
