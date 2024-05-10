import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import { getAuthInfo } from "../LoginForm/auth";
import { useNotification } from "../Noti/Noti";
const defaultUserImage = "https://bootdey.com/img/Content/avatar/avatar1.png"; // Đường dẫn đến ảnh mặc định

const EditStudentProfile = () => {
  const { username, role } = getAuthInfo();
  const {showNotification}=useNotification();
  const send_uid = username;
  console.log("send_uid:", send_uid);

  // Khởi tạo các state để lưu trữ thông tin người dùng
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [birth, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [selectedFid, setSelectedFid] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultUserImage);
  const [avatarFile, setAvatarFile] = useState(null);
  const [fidList, setFidList] = useState([]);
  const [classList, setClassList] = useState([]);

  const navigate = useNavigate();
  const handleReset = () => {
    setName("");
    setEmail("");
    setBirthDate("");
    setGender("");
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
          setSelectedFid(userData.fid);
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

  // Lấy dữ liệu FID từ back-end
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_fids")
      .then((response) => {
        if (response.data && Array.isArray(response.data.fids)) {
          setFidList(response.data.fids);
        }
      })
      .catch((error) => {
        console.error("Error fetching FID data:", error);
      });
  }, []);

  // Lấy dữ liệu lớp dựa trên FID đã chọn từ back-end
  useEffect(() => {
    if (selectedFid) {
      axios
        .post("http://127.0.0.1:8000/get_classes/", { fid: selectedFid })
        .then((response) => {
          if (response.data && Array.isArray(response.data.classes)) {
            setClassList(response.data.classes);
          }
        })
        .catch((error) => {
          console.error("Error fetching classes data:", error);
        });
    }
  }, [selectedFid]);

  // Xử lý sự kiện Save
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uid", send_uid);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", id);
    formData.append("birth", birth);
    formData.append("gender", gender);
    formData.append("fid", selectedFid);
    formData.append("class_name", selectedClass);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    axios
      .post("http://127.0.0.1:8000/edit_user_view", formData)
      .then((response) => {
        console.log("User Edited successfully:", response.data);
        showNotification("Edit Profile Successfully","success");
        navigate("/home/user");
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
                  readOnly
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Birth Date</label>
                <input
                  type="date"
                  class="form-input"
                  value={birth}
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
                <label class="form-label">Faculty Name</label>
                <select
                  class="form-input"
                  value={selectedFid}
                  onChange={(e) => setSelectedFid(e.target.value)}
                  disabled={!classList.length || true}  /* Vô hiệu hóa phần tử `select` */
                >
                  <option value="">Select class id</option>
                  {fidList.map((fid) => (
                    <option key={fid.value} value={fid.value}>
                      {fid.text}
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
                //   disabled={!classList.length || true}  /* Vô hiệu hóa phần tử `select` */
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

export default EditStudentProfile;
