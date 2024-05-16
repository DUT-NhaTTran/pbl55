import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import axios from "axios";
import "./Charts.css";

const ActivityChart = ({selectedDate}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get_tags_and_counts", {
          params: {
            date: selectedDate
          }
        });
        setChartData(response.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [selectedDate]); // Thêm selectedDate vào danh sách dependency
  

  const totalBooks = chartData.reduce((acc, item) => acc + item.count, 0);
  const maxBooks = Math.ceil(totalBooks * 1.5); // Làm tròn lên để đảm bảo không có số thập phân

  // Kiểm tra xem chartData có rỗng hay không
  if (chartData.length === 0) {
    const emptySeries = [{ name: 'Number of Books', data: [0] }];
    const emptyOptions = {
      chart: {
        height: 350,
        width: "10%", // Chỉnh lại width
        type: "bar",
      },
      plotOptions: {
        bar: {
          vertical: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['No data'], // Không có dữ liệu, chỉ có một nhãn 'No data'
        title: {
          text: "Tag",
        },
      },
      yaxis: {
        title: {
          text: "Number of Books",
        },
        min: 0, // Đặt giá trị min cho trục y
        max: 10, // Đặt giá trị max cho trục y là 10 (giả định)
        tickAmount: 10, // Đảm bảo số lượng tick trên trục y là số nguyên
        labels: {
          formatter: (val) => Math.round(val), // Định dạng nhãn trục y để đảm bảo không có số thập phân
        },
      },
    };

    return (
      <div className="chart activity-chart">
        <h3 className="chart-title" style={{ marginBottom: "100px" }}>Number of Books by Tag</h3>
        <ReactApexChart
          options={emptyOptions}
          series={emptySeries}
          type="bar"
          height={350}
        />
      </div>
    );
  }

  const options = {
    chart: {
      height: 350,
      width: "10%", // Chỉnh lại width
      type: "bar",
    },
    plotOptions: {
      bar: {
        vertical: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.map(item => item.tag),
      title: {
        text: "Tag",
      },
    },
    yaxis: {
      title: {
        text: "Number of Books",
      },
      min: 0, // Đặt giá trị min cho trục y
      max: maxBooks, // Đặt giá trị max cho trục y dựa trên tổng số sách * 1.5
      tickAmount: maxBooks, // Đảm bảo số lượng tick trên trục y là số nguyên
      labels: {
        formatter: (val) => Math.round(val), // Định dạng nhãn trục y để đảm bảo không có số thập phân
      },
    },
  };

  const series = [{
    name: 'Number of Books',
    data: chartData.map(item => item.count),
  }];

  return (
    <div className="chart activity-chart">
      <h3 className="chart-title" style={{ marginBottom: "100px" }}>Number of Books by Tag</h3>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ActivityChart;
