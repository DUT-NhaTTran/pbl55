import React from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import axios from "axios";
import { useState } from "react";

const LoginForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(Validation(values));
   
    if (errors.usernameTxt === "" && errors.passwordTxt === "") {
      
      axios
        .post("http://127.0.0.1:8000/account", values)
        .then((res) => {
          if (res.data === 'Success') {
            
            navigate("/Home");
          } else {
            alert("No record");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const navigate = useNavigate();
  const [values, setValues] = useState({
    usernameTxt: '',
    passwordTxt: ''
  })
  const [errors, setErrors] = useState({});
  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          <a href="#">Forgot password ?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Don't have an account ? <a href="#">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
