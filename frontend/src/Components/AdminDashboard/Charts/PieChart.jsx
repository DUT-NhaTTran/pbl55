import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import axios from "axios";

const PieChart = ({ selectedDateTime }) => {
  const [checkinCount, setCheckinCount] = useState(0);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(false); // State để kiểm tra dữ liệu có sẵn hay không

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Đánh dấu đang tải dữ liệu
        const checkinResponse = await axios.get("http://127.0.0.1:8000/user_checking_data", {
          params: { date: selectedDateTime }
        });
        const borrowedBooksResponse = await axios.get("http://127.0.0.1:8000/get_borrow_book_count", {
          params: { date: selectedDateTime }
        });
        
        setCheckinCount(checkinResponse.data.row_count);
        setBorrowedBooksCount(borrowedBooksResponse.data.total_borrow_book);
        setLoading(false); // Đánh dấu đã tải xong dữ liệu
        if (checkinResponse.data.row_count > 0 || borrowedBooksResponse.data.total_borrow_book > 0) {
          setDataAvailable(true); // Nếu có ít nhất một giá trị khác 0, đặt state là true
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Đánh dấu đã tải xong dù có lỗi xảy ra
      }
    };

    fetchData();
  }, [selectedDateTime]); // Thêm selectedDateTime vào mảng dependency của useEffect

  // Kiểm tra nếu không có dữ liệu
  if (!dataAvailable) {
    return <div>No data</div>;
  }

  const remainingBorrowedBooks = borrowedBooksCount - checkinCount;
  const data = {
    Late: checkinCount,
    Intime: remainingBorrowedBooks,
  };

  const options = {
    labels: Object.keys(data),
    colors: ["#FF4560", "#008FFB"],
    legend: {
      position: "bottom",
    },
  };

  const series = Object.values(data);

  // Kiểm tra nếu đang tải dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chart sales-chart">
      <h3 className="chart-title">Pie Chart</h3>
      <Chart options={options} series={series} type="pie" height={350} />
      <p>Total Borrowed Books: {borrowedBooksCount}</p>
      <p>Total late Check-in: {checkinCount}</p>
      <p>Remaining On-time Check-ins: {remainingBorrowedBooks}</p>
    </div>
  );
};

export default PieChart;
