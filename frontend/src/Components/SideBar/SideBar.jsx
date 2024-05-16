import React from "react";

import "../SideBar/SideBar.css";
import { clearAuthInfo, getAuthInfo } from "../LoginForm/auth";
import { BiHome, BiBookAlt, BiSolidReport, BiTask } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
const SideBar = () => {
  const navigate = useNavigate();
  const { role } = getAuthInfo(); // Lấy thông tin role từ hàm getAuthInfo()
  console.log("role ne",role);
 

  return (
    <div className="menu">
      <div className="logo">
        <BiBookAlt />
        <h6>Library</h6>
      </div>
      <div className="menu--list">
        {role == 0 ? (
          <>
            <Link to="/home/user" className="item">
              <BiTask className="icon" />
              Borrowed Books
            </Link>
            <Link to="/home/editstudentprofile" className="item">
              <BiSolidReport className="icon" />
              User
            </Link>
            <Link to="/home/booklist" className="item">
              <BiSolidReport className="icon" />
              Books Collection
            </Link>
          </>
        ) : role == 1 ? (
          <>
            <Link to="/home/content" className="item">
              <BiHome className="icon" />
              Check In
            </Link>
            {/* Hiển thị các mục dành cho role 1 */}
            <Link to="/home/booklist" className="item">
              <BiSolidReport className="icon" />
              Books Collection
            </Link>
            <Link to="/home/studentmanagement" className="item">
              <BiSolidReport className="icon" />
              Student Management
            </Link>
            {/* <Link to="/home/studentchecking" className="item">
              <BiSolidReport className="icon" />
              Student Checking
            </Link> */}
            <Link to="/home/admindashboard" className="item">
              <BiSolidReport className="icon" />
              Admin Dashboard
            </Link>
            {/* <Link to="/home/create" className="item">
              <BiTask className="icon" />
              Create
            </Link> */}
          </>
        ) : null}{" "}

       
      </div>
    </div>
  );
};

export default SideBar;
