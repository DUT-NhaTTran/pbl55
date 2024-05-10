import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../SideBar/SideBar.css";
import { clearAuthInfo, getAuthInfo } from "../LoginForm/auth";
import { BiHome, BiBookAlt, BiSolidReport, BiTask } from "react-icons/bi";

const SideBar = () => {
  const navigate = useNavigate();
  const { role } = getAuthInfo(); // Lấy thông tin role từ hàm getAuthInfo()
  console.log("role ne",role);
  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    clearAuthInfo();
    // Chuyển hướng người dùng đến trang chủ (login)
    navigate("/");
  };

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
            
            <Link to="/home/create" className="item">
              <BiTask className="icon" />
              Create
            </Link>
          </>
        ) : null}{" "}

        <div onClick={handleLogout} className="item">
          <BiSolidReport className="icon" />
          Log Out
        </div>
      </div>
    </div>
  );
};

export default SideBar;
