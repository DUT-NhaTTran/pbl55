import React from "react";
import ProfileHeader from "./ProfileHeader";
import "../Profile/Profile.css";
import userImage from "../Assets/default-avatar.png";
import { format } from "date-fns";

import defaultUserImage from "../Assets/default-avatar.png"; // Đường dẫn đến ảnh mặc định
const Profile = ({ selectedRecord }) => {
  console.log("Profile received selectedRecord:", selectedRecord);

  return (
    <div className="profile">
      <ProfileHeader />
      <div className="user--profile">
        <div className="user--detail">
          <img
            // src={selectedRecord && selectedRecord.avatar ? selectedRecord.avatar : defaultUserImage}
            // alt="User Avatar"
            src={userImage}
            alt=""
          />
          <h3 className="username">
            {selectedRecord ? selectedRecord.name : "No user selected"}
          </h3>
          <span className="profile_uid">
            {selectedRecord ? selectedRecord.uid : ""}
          </span>
          <span className="profile_info">
            {selectedRecord && (
              <>
                <div>
                  <strong>Class:</strong> {selectedRecord.class_name}
                </div>
                <div>
                  <strong>ID:</strong> {selectedRecord.id}
                </div>
                <div>
                  <strong>Email:</strong> {selectedRecord.email}
                </div>
                <div>
                  <strong>Gender:</strong>{" "}
                  {selectedRecord.gender === 1 ? "Nam" : "Nữ"}
                </div>
                <div>
                  <strong>Birth:</strong>{" "}
                  {format(new Date(selectedRecord.birth), "dd-MM-yyyy")}
                </div>
              </>
            )}
          </span>
        </div>
        <div className="user-courses">
          {selectedRecord && selectedRecord.courses ? (
            selectedRecord.courses.map((course, index) => (
              <div key={index} className="course">
                <div className="course-detail">
                  <div className="course-cover">{course.icon}</div>
                  <div className="course-name">
                    <h5 className="title">{course.title}</h5>
                    <span className="duration">{course.duration}</span>
                  </div>
                </div>
                <div className="action">:</div>
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
