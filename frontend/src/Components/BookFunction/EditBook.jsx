import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../BookFunction/CreateBook.css";

const defaultBookImage = "https://via.placeholder.com/150"; // Đường dẫn ảnh mặc định

const EditBook = () => {
  // Lấy bookId từ state của useLocation
  const location = useLocation();
  const { send_bookId } = location.state || {};
  console.log("send_bookId:", send_bookId);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [bookImagePreviewUrl, setBookImagePreviewUrl] =
    useState(defaultBookImage);
  const [bookImageFile, setBookImageFile] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const navigate = useNavigate();
  const handleReset = () => {
    setBookName("");
    setQuantity("");
    setAuthor("");
    setSelectedCategory("");
    setDescription("");
    setBookImageFile(null);
    setBookImagePreviewUrl("");
  };
  // Gọi API để lấy thông tin sách dựa trên bookId
  useEffect(() => {
    if (send_bookId) {
      axios
        .get(`http://127.0.0.1:8000/get_book_info?bookId=${send_bookId}`)
        .then((response) => {
          const bookData = response.data;
          // Cập nhật state với thông tin sách từ back-end
          setBookName(bookData.book_name);
          setAuthor(bookData.auth);
          setQuantity(bookData.quantity);
          setSelectedCategory(bookData.tag);
          setDescription(bookData.description);
          setBookImagePreviewUrl(
            bookData.book_image
              ? `data:image/png;base64,${bookData.book_image}`
              : defaultBookImage
          );
        })
        .catch((error) => {
          console.error("Error fetching book data:", error);
        });
    }
  }, [send_bookId]);

  // Lấy dữ liệu danh mục từ back-end
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_tags")
      .then((response) => {
        if (response.data && Array.isArray(response.data.tags)) {
          setCategoryList(response.data.tags);
        }
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);

  // Xử lý sự kiện lưu sách
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("book_id", send_bookId);
    formData.append("book_name", bookName);
    formData.append("auth", author);
    formData.append("quantity", quantity);
    formData.append("tag", selectedCategory);
    formData.append("description", description);
    if (bookImageFile) {
      formData.append("book_image", bookImageFile);
    }

    axios
      .post("http://127.0.0.1:8000/edit_book", formData)
      .then((response) => {
        console.log("Book edited successfully:", response.data);
        navigate("/home/booklist");
      })
      .catch((error) => {
        console.error("Error saving book data:", error);
      });
  };

  // Xử lý sự kiện hủy chỉnh sửa sách
  const handleCancel = () => {
    navigate("/home/booklist");
  };

  // Xử lý khi người dùng chọn ảnh sách
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBookImagePreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setBookImageFile(file);
    }
  };

  return (
    <div>
      <div className="header">Edit Book</div>
      <div className="profile-container">
        <div className="profile-header">
          <img src={bookImagePreviewUrl} alt="Book Cover" className="avatar" />
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
                <label className="form-label">BookID</label>
                <input
                  type="text"
                  className="form-input"
                  value={send_bookId}
                  readOnly
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
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
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
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select
                  className="form-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  
                  {categoryList.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.text}
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
                  onClick={handleCancel}
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

export default EditBook;
