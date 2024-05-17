import React, { useEffect, useState } from "react";
import CardList from "./Cards/CardList";
import ColumnChart from "./Charts/ColumnChart";
import PieChart from "./Charts/PieChart";
import ChartContainer from "./Charts/ChartContainer";
import { IoCalendar } from "react-icons/io5"; // Import icon
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); 

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Cập nhật ngày được chọn
  };

  useEffect(() => {
   console.log(selectedDate);
  }, [selectedDate]); 

  // Lấy ngày hiện tại dưới dạng chuỗi YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="calendar-icon" onClick={toggleCalendar}>
        <IoCalendar className="calendar-icon" />
      </div>
      {showCalendar && (
        <input
          type="date"
          className="custom-calendar"
          value={selectedDate}
          onChange={handleDateChange}
          max={today} 
        />
      )}
      <CardList selectedDate={selectedDate}/>
      <ChartContainer>
        <ColumnChart selectedDate={selectedDate} />
        <PieChart selectedDate={selectedDate} />
      </ChartContainer>
    </div>
  );
};

export default AdminDashboard;
