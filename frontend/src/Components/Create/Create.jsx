import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Noti/Noti";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";

const Create = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [fidList, setFidList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [uid, setUid] = useState(localStorage.getItem("uid") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [id, setId] = useState(localStorage.getItem("id") || "");
  const [birthDate, setBirthDate] = useState(localStorage.getItem("birthDate") || "");
  const [gender, setGender] = useState(localStorage.getItem("gender") || "");
  const [selectedFid, setSelectedFid] = useState(localStorage.getItem("selectedFid") || "");
  const [selectedClass, setSelectedClass] = useState(localStorage.getItem("selectedClass") || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setAvatarPreviewUrl(base64Image);
        localStorage.setItem("avatarImage", base64Image);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Sử dụng useCallback cho handleInputChange
  const handleInputChange = useCallback((setter) => (event) => {
    
    const { name, value } = event.target;
    setter(value);
    localStorage.setItem(name, value);

  }, []);

  // Xử lý lưu thông tin người dùng
  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      console.log("Email is invalid");
      showNotification("Email is invalid", "error");
      return;
    }
    // Kiểm tra các trường để đảm bảo chúng không được để trống
    if (!uid || !name || !email || !id || !birthDate || !gender || !selectedFid || !selectedClass) {
        showNotification("All fields are required.", "error");
        return;
    }

    // Kiểm tra avatarFile là bắt buộc
    if (!avatarFile) {
        showNotification("Avatar file is required.", "error");
        return;
    }

    // Tạo FormData để gửi dữ liệu đến API
    const formData = new FormData();
    formData.append("uid", uid);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", id);
    formData.append("birthDate", birthDate);
    formData.append("gender", gender);
    formData.append("fid", selectedFid);
    formData.append("class_name", selectedClass);
    formData.append("avatar", avatarFile);

    try {
        await axios.post("http://127.0.0.1:8000/save_user", formData);
        showNotification("User saved successfully", "success");
        localStorage.setItem("uid", uid);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("id", id);
        localStorage.setItem("birthDate", birthDate);
        localStorage.setItem("gender", gender);
        localStorage.setItem("selectedFid", selectedFid);
        localStorage.setItem("selectedClass", selectedClass);
        localStorage.setItem("avatarImage", avatarPreviewUrl);
        navigate("/home/account");
    } catch (error) {
        showNotification("UID already exist", "error");
    }
  }, [
    uid, name, email, id, birthDate, gender, selectedFid, selectedClass, avatarFile, showNotification, navigate
  ]);
  const handleCancel = () => {
    navigate("/home/studentmanagement");
  };

  // Sử dụng useEffect để khôi phục lại avatarPreviewUrl từ localStorage
  useEffect(() => {
    const savedAvatarImage = localStorage.getItem("avatarImage");
    if (savedAvatarImage) {
      setAvatarPreviewUrl(savedAvatarImage);
    }
  }, []);

  // Sử dụng useEffect để khôi phục lại trạng thái từ localStorage
  useEffect(() => {
    const savedUid = localStorage.getItem("uid");
    const savedName = localStorage.getItem("name");
    const savedEmail = localStorage.getItem("email");
    const savedId = localStorage.getItem("id");
    const savedBirthDate = localStorage.getItem("birthDate");
    const savedGender = localStorage.getItem("gender");
    const savedSelectedFid = localStorage.getItem("selectedFid");
    const savedSelectedClass = localStorage.getItem("selectedClass");

    if (savedUid) setUid(savedUid);
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedId) setId(savedId);
    if (savedBirthDate) setBirthDate(savedBirthDate);
    if (savedGender) setGender(savedGender);
    if (savedSelectedFid) setSelectedFid(savedSelectedFid);
    if (savedSelectedClass) setSelectedClass(savedSelectedClass);
  }, []);

  // Sử dụng useEffect để đọc danh sách FID và class từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fidResponse, classResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/get_fids"),
          selectedFid && axios.post("http://127.0.0.1:8000/get_classes/", {
            fid: selectedFid,
          }),
        ]);

        if (fidResponse.data && Array.isArray(fidResponse.data.fids)) {
          setFidList(fidResponse.data.fids);
        }

        if (classResponse && classResponse.data && Array.isArray(classResponse.data.classes)) {
          setClassList(classResponse.data.classes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedFid]);

  const handleReset = () => {
    setUid("");
    setName("");
    setEmail("");
    setId("");
    setBirthDate("");
    setGender("");
    setSelectedFid("");
    setSelectedClass("");
    setAvatarFile(null);
    setAvatarPreviewUrl(""); // Đặt lại URL của ảnh đã chọn
  };

  return (
    <div class="full-width">
      <div className="header">Create Users</div>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              avatarPreviewUrl ||
              "https://bootdey.com/img/Content/avatar/avatar1.png"
            }
            alt="Avatar"
            className="avatar"
          />
          <div className="profile-actions">
            <label className="upload-button">
              Upload New Photo
              <input
                type="file"
                className="upload-input"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <hr className="divider" />
        <div className="profile-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">UID</label>
                <input
                  type="text"
                  className="form-input"
                  value={uid}
                  onChange={handleInputChange(setUid)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={handleInputChange(setName)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={id}
                  onChange={handleInputChange(setId)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Birth Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={birthDate}
                  onChange={handleInputChange(setBirthDate)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="gender-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Male
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Faculty Name</label>
                <select
                  className="form-input"
                  value={selectedFid}
                  onChange={handleInputChange(setSelectedFid)}
                >
                  <option value="">Select Faculty Name</option>
                  {fidList.map((fid) => (
                    <option key={fid.value} value={fid.value}>
                      {fid.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <select
                  className="form-input"
                  value={selectedClass}
                  onChange={handleInputChange(setSelectedClass)}
                  disabled={!classList.length}
                >
                  <option value="">Select class name</option>
                  {classList.map((classItem) => (
                    <option key={classItem.value} value={classItem.value}>
                      {classItem.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button type="button" className="btn-save" onClick={handleSave}>
                  Save
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
