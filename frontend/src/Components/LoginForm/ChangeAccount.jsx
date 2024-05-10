import React from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ChangeValidation from "./ChangeValidation";
import axios from "axios";
import { useState } from "react";
import {useNotification} from "../Noti/Noti"


const ChangeAccount= () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = ChangeValidation(values);
    setErrors(validationErrors);
   
    if (Object.keys(validationErrors).length === 0) {
        try {
            // Gửi yêu cầu POST
            const response= await axios.post("http://127.0.0.1:8000/account_change", values);
               
            if (response.data === 'Success') {
                navigate("/"); // Chuyển hướng đến trang chủ
            } else {
                showNotification("No record","error");
            }
        } catch (err) {
            // Xử lý lỗi
            console.error("Đã xảy ra lỗi trong quá trình gửi yêu cầu POST hoặc xử lý phản hồi:");
            console.error(err.response ? err.response.data : err.message);
            
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                
                for (const [key, value] of Object.entries(errorData)) {
                    console.error(`${key}: ${value}`);
                }
            }
            
           
        }
    }
    
  };
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    usernameTxt: '',
    passwordTxt: '',
    newpasswordTxt:'',
    reenterpasswordTxt:'',
  })
  const [errors, setErrors] = useState({});
  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          {errors.usernameTxt && (
            <span className="text-danger">{errors.usernameTxt}</span>
          )}
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
          {errors.passwordTxt && (
            <span className="text-danger">{errors.passwordTxt}</span>
          )}
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
          {errors.passwordTxt && (
            <span className="text-danger">{errors.passwordTxt}</span>
          )}
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
          {errors.passwordTxt && (
            <span className="text-danger">{errors.passwordTxt}</span>
          )}
        </div>
        
        <button type="submit">Save Change</button>
        
      </form>
    </div>
  );
};

export default ChangeAccount;