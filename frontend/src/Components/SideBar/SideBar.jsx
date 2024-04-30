import React from "react";
import '../SideBar/SideBar.css'
import {
  BiHome,
  BiBookAlt,
  BiSolidReport,
  BiStats,
  BiTask,
  BiMessage,
  BiHelpCircle,
} from "react-icons/bi";
const SideBar = () => {
  return (
    <div className="menu">
      <div className="logo">
          <BiBookAlt />
          <h2>CheckIO</h2>
        </div>
        <div className="menu--list">
          <a href="#" className="item active">
            <BiHome className="icon" />
            Check In
          </a>
          <a href="#" className="item">
            <BiTask className="icon" />
            Task
          </a>
          <a href="#" className="item">
            <BiSolidReport className="icon" />
            Report
          </a>
          <a href="#" className="item">
            <BiStats className="icon" />
            Stats
          </a>
          <a href="#" className="item">
            <BiMessage className="icon" />
            Message
          </a>
          <a href="#" className="item">
            <BiHelpCircle className="icon" />
            Help
          </a>
        </div>
      </div>
  );
};
export default SideBar;