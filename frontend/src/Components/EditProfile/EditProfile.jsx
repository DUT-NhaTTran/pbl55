import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";

const defaultUserImage = "https://bootdey.com/img/Content/avatar/avatar1.png"; // Đường dẫn đến ảnh mặc định

const EditProfile = () => {
  // Lấy uid từ state của useLocation
  const location = useLocation();
  const { send_uid } = location.state || {};
  console.log("send_uid:", send_uid);

  // Khởi tạo các state để lưu trữ thông tin người dùng
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCid, setSelectedCid] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultUserImage);
  const [avatarFile, setAvatarFile] = useState(null);
  const [cidList, setCidList] = useState([]);
  const [classList, setClassList] = useState([]);

  const navigate = useNavigate();
  const handleReset = () => {
    // Đặt lại tất cả trạng thái về giá trị ban đầu
   
    setName("");
    setEmail("");
    setId("");
    setBirthDate("");
    setGender("");
    setSelectedCid("");
    setSelectedClass("");
    // setAvatarFile(null);
    // setAvatarPreviewUrl(""); 
};
  // Gọi API để lấy thông tin người dùng dựa trên uid (send_uid)
  useEffect(() => {
    if (send_uid) {
      axios
        .get(`http://127.0.0.1:8000/get_user_info?uid=${send_uid}`)
        .then((response) => {
          const userData = response.data;
          // Cập nhật state với thông tin người dùng từ back-end
          setName(userData.name);
          setEmail(userData.email);
          setId(userData.id);
          setBirthDate(userData.birth);
          setGender(userData.gender);
          setSelectedCid(userData.cid);
          setSelectedClass(userData.class_name);
          setAvatarPreviewUrl(
            userData.avatar
              ? `data:image/png;base64,${userData.avatar}`
              : defaultUserImage
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [send_uid]);

  // Lấy dữ liệu CID từ back-end
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_cids")
      .then((response) => {
        if (response.data && Array.isArray(response.data.cids)) {
          setCidList(response.data.cids);
        }
      })
      .catch((error) => {
        console.error("Error fetching CID data:", error);
      });
  }, []);

  // Lấy dữ liệu lớp dựa trên CID đã chọn từ back-end
  useEffect(() => {
    if (selectedCid) {
      axios
        .post("http://127.0.0.1:8000/get_classes/", { cid: selectedCid })
        .then((response) => {
          if (response.data && Array.isArray(response.data.classes)) {
            setClassList(response.data.classes);
          }
        })
        .catch((error) => {
          console.error("Error fetching classes data:", error);
        });
    }
  }, [selectedCid]);

  // Xử lý sự kiện Save
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uid", send_uid);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", id);
    formData.append("birthDate", birthDate);
    formData.append("gender", gender);
    formData.append("cid", selectedCid);
    formData.append("className", selectedClass);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    axios
      .post("http://127.0.0.1:8000/edit_user_view", formData)
      .then((response) => {
        console.log("User Edited successfully:", response.data);
        navigate("/home/content");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  };

  // Xử lý sự kiện Cancel
  const handleCancel = () => {
    navigate("/home/content");
  };

  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  return (
    <div>
      <div className="header">Edit Users</div>
      <div className="profile-container">
        <div className="profile-header">
          <img src={avatarPreviewUrl} alt="Avatar" className="avatar" />
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
                  value={send_uid}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label class="form-label">Name</label>
                <input
                  type="text"
                  class="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="form-label">ID</label>
                <input
                  type="text"
                  class="form-input"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Birth Date</label>
                <input
                  type="date"
                  class="form-input"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <div class="gender-options">
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 1}
                      onChange={() => setGender(1)}
                    />
                    Male
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 0}
                      onChange={() => setGender(0)}
                    />
                    Female
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">CID</label>
                <select
                  class="form-input"
                  value={selectedCid}
                  onChange={(e) => setSelectedCid(e.target.value)}
                >
                  <option value="">Select class id</option>
                  {cidList.map((cid) => (
                    <option key={cid.value} value={cid.value}>
                      {cid.text}
                    </option>
                  ))}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Class Name</label>
                <select
                  class="form-input"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
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
              <div class="button-group">
                <button type="button" class="btn-save" onClick={handleSave}>
                  Save
                </button>
                <button type="button" class="btn-cancel" onClick={handleCancel}>
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

export default EditProfile;
