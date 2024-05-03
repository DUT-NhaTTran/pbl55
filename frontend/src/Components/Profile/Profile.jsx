import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import "../Profile/Profile.css";
import defaultUserImage from "../Assets/default-avatar.png"; // Đường dẫn đến ảnh mặc định
import { format } from "date-fns";
import axios from "axios";
const Profile = ({ selectedRecord }) => {
  // console.log("Profile received selectedRecord:", selectedRecord);

  const [userImageUrl, setUserImageUrl] = useState(defaultUserImage);
  useEffect(() => {
    if (selectedRecord) {
        axios.post('http://127.0.0.1:8000/get_avatar_url', { sr: selectedRecord.uid })
            .then(response => {
                if (response.data && response.data.avatar_url) {
                    setUserImageUrl(`data:image/png;base64,${response.data.avatar_url}`);
                } else {
                    console.error("Avatar URL not found in response data");
                }
            })
            .catch(error => {
                console.error("Error fetching user avatar:", error);
            });
    }
}, [selectedRecord]);

  return (
    <div className="profile">
      <ProfileHeader />
      <div className="user--profile">
        <div className="user--detail">
          {/* Hiển thị ảnh người dùng */}
          <img src={userImageUrl} alt="User Avatar" />

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
