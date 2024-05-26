import React, { useEffect, useState } from "react";
import "../User/User.css";
import { format } from "date-fns";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getAuthInfo } from "../LoginForm/auth"; // Nhập `getAuthInfo`
import UserBookList from "../UserBookList/UserBookList";
import UserHeader from "./UserHeader";
const User = () => {
  const { username } = getAuthInfo();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(""); // State lưu trữ hàng được chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);

  const handleRowClick = (row) => {
    console.log("Selected row:", row);

    setSelectedRecord(row); // Cập nhật state với hàng được chọn
  };
  useEffect(() => {
    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        axios
          .get(`http://127.0.0.1:8000/view_borrow_books?uid=${username}`)
          .then((res) => {
            // Kiểm tra kết quả của API để đảm bảo rằng dữ liệu hợp lệ
            if (res.data && Array.isArray(res.data)) {
              setRecords(res.data);
            } else {
              console.error(
                "Invalid API response data for borrow book info list."
              );
            }
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/view_borrow_books?uid=${username}`
      );

      setRecords(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const columns = [
    {
      name: "Book ID",
      selector: (row) => row.id,
    },
    {
      name: "Book Name",
      selector: (row) => row.book_name,
      wrap: true,
    },
    {
      name: "Day Borrowed",
      selector: (row) => format(new Date(row.day_borrow), "dd-MM-yyyy"),
    },
    {
      name: "Day Return",
      selector: (row) =>
        row.day_return ? format(new Date(row.day_return), "dd-MM-yyyy") : "",
    },
    {
      name: "Limit Day",
      selector: (row) => row.limit_day,
    },
  ];

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/search_books_dtb",
          {
            params: {
              username: username,
              searchQuery: query,
            },
          }
        );
        setRecords(response.data);
      } catch (err) {
        console.error("Error fetching search data:", err);
      }
    } else {
      fetchData();
    }
  };
  const filteredRecords = records.filter(
    (record) =>
      record.book_name &&
      record.book_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="book-list-container">
      <div className={selectedRecord ? "datatable-split" : "datatable-full"}>
        <UserHeader handleSearch={handleSearch} />

        <DataTable
          columns={columns}
          data={searchQuery ? filteredRecords : records}
          pagination
          selectableRows
          onRowClicked={handleRowClick}
          onSelectedRowsChange={(state) =>
            setSelectedRows(state.selectedRows.map((row) => row.uid))
          }
        />
      </div>

      {selectedRecord && (
        <div className="profile-split">
          <UserBookList selectedRecord={selectedRecord} />
        </div>
      )}
    </div>
  );
};

export default User;
