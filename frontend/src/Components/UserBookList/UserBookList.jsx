import React, { useEffect, useState } from "react";
import defaultUserImage from "../Assets/default-avatar.png"; // Đường dẫn đến ảnh mặc định
import "../UserBookList/UserBookList.css";
import axios from "axios";
import UserBookListHeader from "./UserBookListHeader";


const UserBookList = ({ selectedRecord }) => {
  const [borrowBooks, setBorrowBooks] = useState([]); // Sách được chọn

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_book_info?bookId=${selectedRecord.id}`
        );

        // Kiểm tra phản hồi API và cập nhật state
        if (response.status === 200 && response.data) {
          setBorrowBooks([response.data]);
          console.log("Thông tin sách:", response.data);
        } else {
          console.error("Invalid API response data for borrow book info list.");
        }
      } catch (error) {
        console.error("Error fetching book info:", error);
      }
    };

    // Gọi hàm để lấy thông tin sách
    fetchBookInfo();
  }, [selectedRecord]);

  const [userImageUrl, setUserImageUrl] = useState(defaultUserImage);
  const bookImageSrc = borrowBooks[0]?.book_image
  ? `data:image/png;base64,${borrowBooks[0].book_image}`
  : defaultUserImage;



  return (
    <div className="book-list-background">  

      <UserBookListHeader/>
      <div className="book--info">
        <div className="book--detail">
        <img src={bookImageSrc} alt="Book Image" />


       
          <span className="book_info">
            {borrowBooks.length > 0 && (
              <>
                <div>
                  <strong className="profile_info">Book ID:</strong> {borrowBooks[0].book_id}
                </div>
                <div>
                  <strong className="profile_info">Book Name:</strong> {borrowBooks[0].book_name}
                </div>
                <div>
                  <strong className="profile_info">Quantity:</strong> {borrowBooks[0].quantity}
                </div>
                <div>
                  <strong className="profile_info">Tag:</strong> {borrowBooks[0].tag}
                </div>
                <div>
                  <strong className="profile_info">Auth:</strong> {borrowBooks[0].auth}
                </div>
                <div>
                  <strong className="profile_info">Des:</strong> {borrowBooks[0].description}
                </div>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserBookList;
