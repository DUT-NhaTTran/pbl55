import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateBook = () => {
  const [id, setId] = useState("");
  const [bookName, setBookName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const [description, setDescription] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [bookImagePreviewUrl, setBookImagePreviewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_tags"
        );
        setTag(response.data.tags);
        console.log('tag nè ',tag);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchData();
  }, []);
  // Hàm đặt lại các trường trong biểu mẫu
  const handleReset = () => {
    setId("");
    setBookName("");
    setQuantity("");
    setAuthor("");
    setSelectedTag("");
    setDescription("");
    setBookImage(null);
    setBookImagePreviewUrl("");
  };

  // Xử lý khi người dùng chọn ảnh bìa sách
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBookImage(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setBookImagePreviewUrl(e.target.result); // Lưu URL của ảnh đã chọn
      };

      reader.readAsDataURL(file); // Đọc file và tạo URL
    }
  };
  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  // Hàm xử lý lưu thông tin sách
  const handleSave = (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    const formData = new FormData();

    // Thêm dữ liệu vào formData
    formData.append("id", id);
    formData.append("book_name", bookName);
    formData.append("quantity", quantity);
    formData.append("author", author);
    formData.append("tag", selectedTag);

    formData.append("description", description);

    // Thêm ảnh bìa sách vào formData nếu nó tồn tại
    if (bookImage) {
      formData.append("book_image", bookImage);
    }

    // Gọi API và gửi formData
    axios
      .post("http://127.0.0.1:8000/save_book", formData)
      .then((response) => {
        console.log("Book saved successfully:", response.data);
        navigate("/home/booklist");
      })
      .catch((error) => {
        console.error("Error saving book data:", error);
      });
  };

  return (
    <div>
      <div className="header">Create Book</div>
      <div className="book-container">
        <div className="book-header">
          <img
            src={bookImagePreviewUrl || "https://via.placeholder.com/150"}
            alt="Book Cover"
            className="book-image"
          />
          <div className="book-actions">
            <label className="upload-button">
              Upload Book Cover
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
        <div className="book-form">
          <div className="row">
            {/* Cột 1 */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Book Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            {/* Cột 2 */}
            <div className="col-md-6">
              <div className="form-group">
              <label className="form-label">Tags</label>

              <select
                  className="form-input"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  {/* Tùy chọn mặc định */}
                  <option value="">Select Tag</option>
                  {/* Lặp qua danh sách FID để tạo các tùy chọn */}
                  {tag.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="button-group">
                <button type="button" className="btn-save" onClick={handleSave}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate("/home/booklist")}
                >
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

export default CreateBook;
