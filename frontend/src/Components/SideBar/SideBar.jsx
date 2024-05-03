import React from "react";
import { Link } from "react-router-dom";
import "../SideBar/SideBar.css";
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
                <Link to="/home/content" className="item">
                    <BiHome className="icon" />
                    Check In
                </Link>
                <Link to="/home/create" className="item">
                    <BiTask className="icon" />
                    Create
                </Link>
                <Link to="/home/booklist" className="item">
                    <BiSolidReport className="icon" />
                    Books Collection
                </Link>
               
            </div>
        </div>
    );
};

export default SideBar;
