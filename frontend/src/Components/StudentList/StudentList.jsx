import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentHeader from "../Content/ContentHeader";
import DataTable from "react-data-table-component";
import "../StudentList/StudentList.css";
import Profile from "../Profile/Profile";
import "../Profile/Profile.css";
import { format } from "date-fns";
import { useNotification } from "../Noti/Noti";
const StudentList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(""); // State lưu trữ hàng được chọn
  const [data, setData] = useState([]);
  const {showNotification}=useNotification();
  useEffect(() => {
    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/user");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Gọi hàm fetchData để lấy dữ liệu từ API
    fetchData();

    // Sử dụng setInterval để gọi API định kỳ (có thể điều chỉnh thời gian gọi)
    const interval = setInterval(fetchData, 5000);

    // Cleanup function khi component unmounts
    return () => clearInterval(interval);
}, []);

  // Hàm fetchData để lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/user");
      setRecords(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Hàm handleSearch để tìm kiếm dữ liệu
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user/search", {
          params: { searchQuery: query },
        });
        setRecords(response.data);
      } catch (err) {
        console.error("Error fetching search data:", err);
      }
    } else {
      fetchData();
    }
  };

  // Hàm handleDeleteSelected để xóa bản ghi đã chọn
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      showNotification("Please select records to delete.","error");
      return;
    }

    try {
      await axios.delete("http://127.0.0.1:8000/user/delete", {
        data: { uids: selectedRows },
      });

      showNotification("Records deleted successfully.","success");
      fetchData();
      setSelectedRows([]);
    } catch (err) {
      console.error("Error deleting records:", err);
      showNotification("Error deleting records.","error");
    }
  };

  // Lọc dữ liệu dựa trên searchQuery
  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uid.includes(searchQuery)
  );
  const handleRowClick = (row) => {
    console.log("Selected row:", row);

    setSelectedRecord(row); // Cập nhật state với hàng được chọn
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
  },1000);

  // Cleanup function to clear the interval when the component unmounts
  return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.uid,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Time_in",
      selector: (row) => {
        const dateTime = new Date(row.time_in);
        return format(dateTime, "yyyy-MM-dd HH:mm:ss");

      },
      sortable:true,
      wrap: true,
    },
    {
      name: "Time_out",
      selector: (row) => {
        const dateTime = new Date(row.time_out);
        return format(dateTime, "yyyy-MM-dd HH:mm:ss");
      },
      sortable:true,
      wrap: true,
    },
    {
      name: "Class Name",
      selector: (row) => row.class_name,
      
    },
  ];
  return (
    <div className="student-list-container">
        <div className={selectedRecord ? 'datatable-container-70' : 'datatable-container-100'}>
            <ContentHeader handleSearch={handleSearch} />
            <button className="delete-selected-btn" onClick={handleDeleteSelected}>
                Delete Selected
            </button>

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
        {/* Hiển thị `profile-container` chỉ khi có hàng được chọn */}
        {selectedRecord && (
            <div className="profile-container">
                <Profile selectedRecord={selectedRecord} />
            </div>
        )}
    </div>
);

};
export default StudentList;
