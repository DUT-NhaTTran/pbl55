import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import axios from "axios";
import "./Charts.css";

const ColumnChart = ({ selectedDateTime }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get_tags_and_counts", {
          params: {
            date: selectedDateTime
          }
        });
        setChartData(response.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDateTime]);

  const totalBooks = chartData.reduce((acc, item) => acc + item.count, 0);
  const maxBooks = Math.ceil(totalBooks * 0.5);
  const tickAmount = 10;
  const tickStep = Math.ceil(maxBooks / tickAmount);

  if (chartData.length === 0) {
    const emptySeries = [{ name: 'Number of Books', data: [0] }];
    const emptyOptions = {
      chart: {
        height: 350,
        width: "10%",
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
        categories: ['No data'],
        title: {
          text: "Tag",
        },
      },
      yaxis: {
        title: {
          text: "Number of Books",
        },
        min: 0,
        max: 10,
        tickAmount: 10,
        labels: {
          formatter: (val) => Math.round(val),
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
      width: "10%",
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
      min: 0,
      max: tickStep * tickAmount,
      tickAmount: tickAmount,
      labels: {
        formatter: (val) => Math.round(val),
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

export default ColumnChart;
