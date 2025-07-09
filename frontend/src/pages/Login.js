import React, { useState } from "react";
import axios from "axios";
import { backendUrl, useShop } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken } = useShop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Đã nhấn nút đăng nhập");
    console.log("backendUrl:", backendUrl);

    try {
      const res = await axios.post(`${backendUrl}/users/login`, {
        email,
        password,
      });
      console.log("Phản hồi từ server:", res.data);

      const { token } = res.data;
      setToken(token); 
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      toast.error(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleRegister = () => {
    navigate("/dang-ky");
  };

  const handleForgotPassword = () => {
    alert("Chuyển tới trang Quên mật khẩu");
  };


  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Đăng nhập tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
        >
          Đăng nhập
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <button
          onClick={handleRegister}
          className="text-green-600 hover:underline focus:outline-none"
          type="button"
        >
          Đăng ký
        </button>
        <button
          onClick={handleForgotPassword}
          className="text-green-600 hover:underline focus:outline-none"
          type="button"
        >
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
}
