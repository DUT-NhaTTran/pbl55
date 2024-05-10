import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import "../Profile/Profile.css";
// import "../BookList/modal.css";
import defaultUserImage from "../Assets/default-avatar.png"; // Đường dẫn đến ảnh mặc định
import { format } from "date-fns";
import axios from "axios";
import ReactModal from "react-modal";
import DataTable from "react-data-table-component";

const Profile = ({ selectedRecord }) => {
  const suid = selectedRecord.uid;

  const [borrowBooks, setBorrowBooks] = useState([]); // Sách được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal
  
    const columns = [
      {
        name: "Book ID",
        selector: (row) => row.id,
      },
      {
        name: "Book Name",
        selector: (row) => row.book_name,
      },
      {
        name: "Day Borrowed",
        selector: (row) => format(new Date(row.day_borrow), "dd-MM-yyyy"),
      },
      {
        name: "Day Return",
        selector: (row) => format(new Date(row.day_return), "dd-MM-yyyy"),
      },
      {
        name: "Limit Day",
        selector: (row) => row.limit_day,
      },
    ];
    // Hàm để mở modal
    const openModal = () => {
      setIsModalOpen(true);
    };

    // Hàm để đóng modal
    const closeModal = () => {
      setIsModalOpen(false);
    };

    // Hàm để gọi API và cập nhật `borrowBooks`
    const handleViewBorrowBook = () => {
      axios
        .get(`http://127.0.0.1:8000/view_borrow_books?uid=${suid}`)
        .then((res) => {
          // Kiểm tra kết quả của API để đảm bảo rằng dữ liệu hợp lệ
          if (res.data && Array.isArray(res.data)) {
            setBorrowBooks(res.data);
            openModal(); // Mở modal sau khi cập nhật borrowBooks
          } else {
            console.error(
              "Invalid API response data for borrow book info list."
            );
          }
        })
        .catch((err) => console.error(err));
    };

    // Hàm xử lý việc đóng modal
    useEffect(() => {
      if (borrowBooks.length > 0) {
        // Gọi `openModal` sau khi borrowBooks được cập nhật
        openModal();
      }
    }, [borrowBooks]);

    const [userImageUrl, setUserImageUrl] = useState(defaultUserImage);
    useEffect(() => {
      if (selectedRecord) {
        axios
          .post("http://127.0.0.1:8000/get_avatar_url", {
            sr: selectedRecord.uid,
          })
          .then((response) => {
            if (response.data && response.data.avatar_url) {
              setUserImageUrl(
                `data:image/png;base64,${response.data.avatar_url}`
              );
            } else {
              console.error("Avatar URL not found in response data");
            }
          })
          .catch((error) => {
            console.error("Error fetching user avatar:", error);
          });
      }
    }, [selectedRecord]);

    return (
      <div className="profile">
        <ProfileHeader selectedRecord={selectedRecord} />
        <div className="user--profile">
          <div className="user--detail">
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

          <button className="button-save" onClick={handleViewBorrowBook}>
            View Detail
          </button>
        </div>

        {/* ReactModal để hiển thị thông tin sách mượn */}
        <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Chi tiết sách"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
          {/* Hiển thị thông tin sách mượn */}
          <div>
            <h3>Borrowed Books</h3>
            <DataTable columns={columns} data={borrowBooks} pagination />
            <button onClick={closeModal}>Close</button>
          </div>
        </ReactModal>
      </div>
    );
  };

export default Profile;
