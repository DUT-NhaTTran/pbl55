import React from "react";
import { BiNotification, BiSearch } from "react-icons/bi";

const StudentHeader = ({ handleSearch }) => {
  return (
    <div className="content--header">
      <h1 className="header--title">Student Management</h1>
      <div className="header--activity">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search anything ...."
            onChange={handleSearch} // Gọi handleSearch khi giá trị trong input thay đổi
          />

          <BiSearch className="icon" />
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
