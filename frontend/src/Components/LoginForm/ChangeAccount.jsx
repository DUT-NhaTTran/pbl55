// ChangeAccount.js
import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChangeValidation from "./ChangeValidation";
import { useNotification } from "../Noti/Noti";

const ChangeAccount = () => {
  const [values, setValues] = useState({
    usernameTxt: "",
    passwordTxt: "",
    newpasswordTxt: "",
    reenterpasswordTxt: "",
  });
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = ChangeValidation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Gửi yêu cầu POST
        const response = await axios.post(
          "http://127.0.0.1:8000/account_change",
          values
        );

        if (response.data.message === "Success") {
          showNotification("Successfully changed", "success");
          navigate("/"); // Chuyển hướng đến trang chủ
        } else {
          showNotification("Account or password does not exist", "error");
        }
      } catch (err) {
        // Xử lý lỗi
        showNotification(
          err.response ? err.response.data : err.message,
          "error"
        );

        if (err.response && err.response.data) {
          const errorData = err.response.data;

          for (const [key, value] of Object.entries(errorData)) {
            showNotification(`${key}: ${value}`);
          }
        }
      }
    } else {
      // Nếu có lỗi, in ra thông báo lỗi
      for (const [key, value] of Object.entries(validationErrors)) {
        showNotification(` ${value}`, "error");
      }
    }
  };

  return (
    <div className="wrapper">
      <form action="" onSubmit={handleSubmit}>
        <h1>Change Password</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            name="usernameTxt"
            onChange={handleInput}
            required
          />
          <FaUser className="icon" />
         
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Old Password"
            name="passwordTxt"
            onChange={handleInput}
            required
          />
          <FaLock className="icon" />
         
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="New Password"
            name="newpasswordTxt"
            onChange={handleInput}
            required
          />
          <FaLock className="icon" />
          
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Re-enter Password"
            name="reenterpasswordTxt"
            onChange={handleInput}
            required
          />
          <FaLock className="icon" />
          
        </div>

        <button type="submit">Save Change</button>
      </form>
    </div>
  );
};

export default ChangeAccount;
