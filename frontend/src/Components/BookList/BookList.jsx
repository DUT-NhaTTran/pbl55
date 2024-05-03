import React, { useState, useEffect } from "react";
import axios from "axios"; // Nhập axios
import Tags from "../Tags/Tags";
import "../BookList/BookList.css";
import { AiFillStar } from "react-icons/ai";
import { BsFillBagHeartFill } from "react-icons/bs";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [BookImagePreviewUrl, setBookImagePreviewUrl] = useState(""); // URL của ảnh đã chọn

  useEffect(() => {
    // Gọi API để lấy danh sách sách
    async function fetchBooks() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_books_info"
        );
        setBooks(response.data.books_info);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="booklist-page">
        <Tags />
        <section className="card-container">
            {books.map((book, index) => (
                <section key={index} className="card">
                    {/* Hiển thị ảnh bìa sách */}
                    <img src={`data:image/png;base64,${book.book_image}`} className="card-img" alt="book cover" />

                    {/* Hiển thị chi tiết sách */}
                    <div className="card-details">
                        {/* Hiển thị tiêu đề sách */}
                        <div className="book-title">
                            <h3>{book.book_name}</h3>
                        </div>

                        {/* Hiển thị thông tin về tác giả */}
                        <div className="book-author">
                            <span className="author-label">Tác giả:</span> {/* Tiêu đề "Tác giả" */}
                            <span className="author-name">{book.auth}</span> {/* Tên tác giả */}
                        </div>
                        
                        {/* Hiển thị thông tin về số lượng sách */}
                        <div className="book-quantity">
                            <span className="quantity-label">Số lượng:</span> {/* Tiêu đề "Số lượng" */}
                            <span className="quantity-value">{book.quantity}</span> {/* Giá trị số lượng */}
                        </div>

                        {/* Bạn có thể thêm các thông tin khác ở đây */}
                    </div>
                </section>
            ))}
        </section>
    </div>
);
}