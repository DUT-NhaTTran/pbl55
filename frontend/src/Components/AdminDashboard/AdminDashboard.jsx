import React, { useEffect, useState } from "react";
import CardList from "./Cards/CardList";
import ColumnChart from "./Charts/ColumnChart";
import PieChart from "./Charts/PieChart";
import ChartContainer from "./Charts/ChartContainer";
import { IoCalendar } from "react-icons/io5"; // Import icon
import "./AdminDashboard.css";

const toVietnamISOString = (date) => {
  const tzOffset = 7 * 60 * 60 * 1000; 
  const vietnamTime = new Date(date.getTime() + tzOffset);
  return vietnamTime.toISOString().slice(0, -1); // Remove the 'Z' at the end
};

const AdminDashboard = () => {
  const timeZone = "Asia/Ho_Chi_Minh"; // Vietnam timezone
  const today = new Date().toLocaleDateString('en-CA', { timeZone }); // Format as YYYY-MM-DD in Vietnam time
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDateTime, setSelectedDateTime] = useState(toVietnamISOString(new Date())); 

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue); // Update displayed date
    const [hours, minutes, seconds] = new Date(selectedDateTime).toLocaleTimeString('en-GB', { timeZone, hour12: false }).split(':');
    const newDateTime = new Date(`${dateValue}T${hours}:${minutes}:${seconds}+07:00`).toISOString();
    setSelectedDateTime(newDateTime);
  };

  useEffect(() => {
    console.log("in",selectedDateTime); // Log full datetime
  }, [selectedDateTime]);

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
      <CardList selectedDateTime={selectedDateTime} />
      <ChartContainer>
        <ColumnChart selectedDateTime={selectedDateTime} />
        <PieChart selectedDateTime={selectedDateTime} />
      </ChartContainer>
    </div>
  );
};

export default AdminDashboard;
