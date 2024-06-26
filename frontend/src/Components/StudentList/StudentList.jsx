import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentHeader from "../Content/ContentHeader";
import DataTable from "react-data-table-component";
import { IoCalendar } from "react-icons/io5"; // Import IoCalendar icon
import "../StudentList/StudentList.css";
import Profile from "../Profile/Profile";
import "../Profile/Profile.css";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Noti/Noti";
import config from '../../config'; 

const StudentList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Fetch data initially with today's date
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data when selectedDate changes
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // const fetchData = async () => {
  //   try {
  //     const dateToFetch = selectedDate || new Date().toISOString().split("T")[0];
  //     // Clear old records before fetching new ones
  //     setRecords([]);
  //     const response = await axios.get(`${config.apiUrl}/user`, {
  //       params: { selectedDate: dateToFetch }
  //     });
  //     setRecords(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const fetchData = async () => {
    try {
      // Determine the date to fetch: use selectedDate if it's set, otherwise fetch for today
      const dateToFetch = selectedDate !== "" ? selectedDate : null;
      
      // Clear old records before fetching new ones
      setRecords([]);
      
      // Make the API request
      const response = await axios.get(`${config.apiUrl}/user`, {
        params: { selectedDate: dateToFetch }
      });
      
      // Process the response data
      const recordsWithId = response.data.map(record => ({
        ...record,
      }));
      setRecords(recordsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(`${config.apiUrl}/user/search`, {
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

  const handleViewAll = () => {
    setSelectedDate(null); // Set selectedDate to null
  };

  const formatTime = (timeString) => {
    if (!timeString) return ""; // Handle cases where timeString is null or undefined
    return timeString.replace("T", " ").replace("Z", "");
  };
  

  // const handleDeleteSelected = async () => {
  //   if (selectedRows.length === 0) {
  //     showNotification("Please select records to delete.", "error");
  //     return;
  //   }

  //   try {
  //     await axios.delete(`${config.apiUrl}/user/deletecheckin`, {
  //       data: { uids: selectedRows },
  //     });

  //     showNotification("Records deleted successfully.", "success");
  //     fetchData();
  //     setSelectedRows([]);
  //   } catch (err) {
  //     console.error("Error deleting records:", err);
  //     showNotification("Error deleting records.", "error");
  //   }
  // };

  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uid.includes(searchQuery)
  );

  const handleRowClick = (row) => {
    console.log("Selected row:", row);
    setSelectedRecord(row);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate); // Update selectedDate in state
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar); // Toggle calendar visibility
  };

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
      selector: (row) => formatTime(row.time_in),
      sortable: true,
      wrap: true,
    },
    {
      name: "Time_out",
      selector: (row) => formatTime(row.time_out),
      sortable: true,
      wrap: true,
    },
    {
      name: "Class Name",
      selector: (row) => row.class_name,
    },
  ];

  return (
    <div className="student-list-container">
      <div
        className={
          selectedRecord ? "datatable-container-70" : "datatable-container-100"
        }
      >
        <ContentHeader handleSearch={handleSearch} />

        {/* Calendar icon */}
        <div className="calendar-icon" onClick={toggleCalendar}>
          <IoCalendar className="calendar-icon" />
        </div>
        {/* Date input field */}
        {showCalendar && (
          <input
            type="date"
            className="custom-calendar"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]} // Set max date to today
          />
        )}
        {/* <button className="create-btn" onClick={handleCreate}>
          Create Checkin
        </button> */}
        <button className="create-btn" onClick={handleViewAll}>
          View All
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
      {selectedRecord && (
        <div className="profile-container">
          <Profile selectedRecord={selectedRecord} />
          <button className="close-profile-btn" onClick={() => setSelectedRecord(null)}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;