import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Noti/Noti";

const Account = () => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [uid, setUid] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  // Sử dụng useEffect để lấy uid từ localStorage và đặt vào state uid và username
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
      setUsername(storedUid); // Đặt username bằng uid
    }
  }, []);

  // Hàm xử lý lưu tài khoản
  const handleSave = async () => {
    if (!passwordPattern.test(password)) {
      showNotification("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character, and be at least 8 characters long.", "error");
      return;
    }

    if (password !== reenterPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/save_account",
        data
      );
      showNotification("Account created successfully", "success");
      localStorage.removeItem("uid");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("id");
      localStorage.removeItem("birthDate");
      localStorage.removeItem("gender");
      localStorage.removeItem("selectedFid");
      localStorage.removeItem("selectedClass");
      localStorage.removeItem("avatarImage");
      navigate("/home/create");
    } catch (error) {
      console.error("Error saving account data:", error);
      showNotification("Error saving account data", "error");
    }
  };

  return (
    <div>
      <div className="header">Create Account</div>
      <hr className="divider" />
      <div className="profile-form">
        <div className="row">
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-input"
              value={username}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Re-Enter Password</label>
            <input
              type="password"
              className="form-input"
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="btn-save" onClick={handleSave}>
            Save
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/home/create")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
