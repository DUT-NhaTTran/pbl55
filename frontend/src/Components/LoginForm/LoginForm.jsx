import React from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import axios from "axios";
import { useState } from "react";
import { setAuthInfo, getAuthInfo, clearAuthInfo } from "./auth";
import { useNotification } from "../Noti/Noti";
const LoginForm = () => {
  const handleForgotPasswordClick = () => {
    navigate("/changeaccount"); // Chuyển hướng người dùng đến trang ChangeAccount
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(Validation(values));

    if (errors.usernameTxt === "" && errors.passwordTxt === "") {
      axios
        .post("http://127.0.0.1:8000/account", values)
        .then((res) => {
          console.log('Response data:', res.data);
          if (res.data.message === "Success") {

            const { username, role } = res.data;
            console.log('auth', username, role);
            
          
            // Lưu thông tin đăng nhập
            setAuthInfo(username, role);
            navigate("/Home");
          } else{
            showNotification("No record","error");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const {showNotification}=useNotification();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    usernameTxt: "",
    passwordTxt: "",
  });
  const [errors, setErrors] = useState({});
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="wrapper">
      <form action="" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            name="usernameTxt"
            onChange={handleInput}
            required
          />
          <FaUser className="icon" />
          {errors.usernameTxt && (
            <span className="text-danger">{errors.usernameTxt}</span>
          )}
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            name="passwordTxt"
            onChange={handleInput}
            required
          />
          <FaLock className="icon" />
          {errors.passwordTxt && (
            <span className="text-danger">{errors.passwordTxt}</span>
          )}
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#" onClick={handleForgotPasswordClick}>
            Forgot password?
          </a>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
