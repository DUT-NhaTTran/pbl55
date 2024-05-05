import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  // Quản lý các trạng thái để lưu trữ dữ liệu đầu vào từ biểu mẫu
  const [cidList, setCidList] = useState([]);
  const [selectedCid, setSelectedCid] = useState("");
  const [classList, setClassList] = useState([]);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(""); // URL của ảnh đã chọn
  const navigate = useNavigate();
  const handleReset = () => {
    setUid("");
    setName("");
    setEmail("");
    setId("");
    setBirthDate("");
    setGender("");
    setSelectedCid("");
    setSelectedClass("");
    setAvatarFile(null);
    setAvatarPreviewUrl(""); // Đặt lại URL của ảnh đã chọn
};
  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setAvatarPreviewUrl(e.target.result); // Lưu URL của ảnh đã chọn
      };

      reader.readAsDataURL(file); // Đọc file và tạo URL
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_cids")
      .then((response) => {
        // Xử lý dữ liệu CID nhận được
        if (response.data && Array.isArray(response.data.cids)) {
          setCidList(response.data.cids);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching CID data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCid) {
      axios
        .post("http://127.0.0.1:8000/get_classes/", { cid: selectedCid })
        .then((response) => {
          const classes = response.data.classes;
          setClassList(classes);
        })
        .catch((error) => {
          console.error("Error fetching classes data:", error);
        });
    }
  }, [selectedCid]);
  const handleSave = (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    const formData = new FormData();

    // Thêm dữ liệu vào formData
    formData.append("uid", uid);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", id);
    formData.append("birthDate", birthDate);
    formData.append("gender", gender);
    formData.append("cid", selectedCid);
    formData.append("className", selectedClass);

    // Thêm avatarFile vào formData nếu nó tồn tại
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    // Gọi API và gửi formData
    axios
      .post("http://127.0.0.1:8000/save_user", formData)
      .then((response) => {
        console.log("User saved successfully:", response.data);
        navigate("/home/account");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  };

  return (
    <div>
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
            {/* Cột 1 */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">UID</label>
                <input
                  type="text"
                  className="form-input"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
            </div>
            {/* Cột 2 */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Birth Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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
                <label className="form-label">CID</label>
                <select
                  className="form-input"
                  value={selectedCid}
                  onChange={(e) => setSelectedCid(e.target.value)}
                >
                  {/* Tùy chọn mặc định */}
                  <option value="">Select class id</option>
                  {/* Lặp qua danh sách CID để tạo các tùy chọn */}
                  {cidList.map((cid) => (
                    <option key={cid.value} value={cid.value}>
                      {cid.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <select
                  className="form-input"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!classList.length}
                >
                  {/* Tùy chọn mặc định */}
                  <option value="">Select class name</option>
                  {/* Lặp qua danh sách các lớp để tạo các tùy chọn */}
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
                <button type="button" className="btn-cancel">
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
