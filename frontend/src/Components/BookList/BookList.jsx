import React, { useState, useEffect } from "react";
import axios from "axios";
import Tags from "../Tags/Tags"; // Thành phần Tags
import "../BookList/BookList.css";
import "../BookList/modal.css"; // Nhập file CSS
import "bootstrap/dist/css/bootstrap.min.css";

import ReactModal from "react-modal";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Sách được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái Modal

  // Hàm để lấy sách theo tag hoặc tất cả sách
  const fetchBooksByTag = async (tag) => {
    try {
      let response;
      if (tag === "" || tag === "all") {
        // Lấy tất cả sách
        response = await axios.get("http://127.0.0.1:8000/get_books_info");
        setBooks(response.data.books_info);
      } else {
        // Lấy sách theo tag cụ thể
        response = await axios.get(
          `http://127.0.0.1:8000/books_by_tag?tag=${tag}`
        );
        setBooks(response.data.books_list);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Khi thành phần được render lần đầu, gọi API để lấy tất cả sách
  useEffect(() => {
    fetchBooksByTag("");
  }, []);

  // Hàm để mở modal và hiển thị thông tin chi tiết sách
  const handleBookClick = (book) => {
    console.log("Đã bấm vào sách:", book);

    console.log("Sách được chọn:", book);
    setSelectedBook(book);
    setIsModalOpen(true);
    console.log("Trạng thái modal:", isModalOpen);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="booklist-page">
      {/* Truyền hàm handleTagSelection cho thành phần Tags */}
      <Tags onTagSelect={fetchBooksByTag} />
      <section className="card-container">
        {books.map((book, index) => (
          <section
            key={index}
            className="card"
            onClick={() => handleBookClick(book)} // Khi bấm vào sách, mở modal
          >
            <img
              src={`data:image/png;base64,${book.book_image}`}
              className="card-img"
              alt="book cover"
            />
            <div className="card-details">
              <div className="book-title">
                <h3>{book.book_name}</h3>
              </div>
              <div className="book-author">
                <span className="author-label">Tác giả:</span>
                <span className="author-name">{book.auth}</span>
              </div>
              <div className="book-quantity">
                <span className="quantity-label">Số lượng:</span>
                <span className="quantity-value">{book.quantity}</span>
              </div>
            </div>
          </section>
        ))}
      </section>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết sách"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedBook && (
          <div className="row">
            <div className="col-md-6">
              <img
                src={`data:image/png;base64,${selectedBook.book_image}`}
                alt="book cover"
                className="modal-image"
              />
            </div>
            <div className="col-md-6">
              <div className="book-title">
                <h3>{selectedBook.book_name}</h3>
              </div>
              <div className="book-author">
                <span className="author-label">Tác giả: </span>
                <span className="author-name">{selectedBook.auth}</span>
              </div>
              <div className="book-quantity">
                <span className="quantity-label">Số lượng: </span>
                <span className="quantity-value">{selectedBook.quantity}</span>
              </div>
              <div className="book-quantity">
                <span className="author-label">Mã sách: </span>
                <span className="author-value">{selectedBook.id}</span>
              </div>
              <div className="book-quantity">
                <span className="author-label">Tag: </span>
                <span className="author-value">{selectedBook.tag}</span>
              </div>
              <div className="book-quantity">
                <span className="author-label">Mô tả: </span>
                <span className="author-value">{selectedBook.description}</span>
              </div>
              <div className="modal-footer">
                <button className="close-button" onClick={closeModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </ReactModal>
    </div>
  );
}
