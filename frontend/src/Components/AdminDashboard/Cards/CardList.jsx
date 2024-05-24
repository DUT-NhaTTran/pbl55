import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "./Cards";
import { IoBook, IoBookSharp, IoCart, IoCash, IoPeople } from "react-icons/io5";

const CardList = ({ selectedDateTime }) => {
  const [booksCount, setBooksCount] = useState(null);
  const [totalBooksCount, setTotalBooksCount] = useState(null);
  const [checkinCount, setCheckinCount] = useState(null);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(null);
  const currentDate = new Date(); // Lấy thời gian hiện tại

  const [currentBooksCount, setCurrentBooksCount] = useState(null);
  const [currentCheckinCount, setCurrentCheckinCount] = useState(null);
  const [currentBorrowedBooksCount, setCurrentBorrowedBooksCount] =
    useState(null);
  const toVietnamISOString = (date) => {
    const tzOffset = 7 * 60 * 60 * 1000; // Vietnam timezone offset (in milliseconds)
    const vietnamTime = new Date(date.getTime() + tzOffset);
    return vietnamTime.toISOString().slice(0, -1); // Remove the 'Z' at the end
  };
  const formattedDate = toVietnamISOString(currentDate); // Chuyển đổi thời gian hiện tại thành chuỗi ISO

  useEffect(() => {
    console.log("In card date", formattedDate, selectedDateTime);
    const getBooksCount = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_books_count",
          {
            params: {
              date: selectedDateTime,
            },
          }
        );
        setBooksCount(response.data.total_books);
        setTotalBooksCount(response.data.total_quantity);
      } catch (error) {
        console.error("Error fetching books count:", error);
      }
    };

    const getCheckinCount = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_checkin_count",
          {
            params: {
              date: selectedDateTime,
            },
          }
        );
        setCheckinCount(response.data.total_checkin);
      } catch (error) {
        console.error("Error fetching checkin count:", error);
      }
    };

    const getBorrowedBooksCount = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_borrow_book_count",
          {
            params: {
              date: selectedDateTime,
            },
          }
        );
        setBorrowedBooksCount(response.data.total_borrow_book);
      } catch (error) {
        console.error("Error fetching borrowed books count:", error);
      }
    };
    const getCurrentData = async () => {
      try {
        if (formattedDate === selectedDateTime) {
          const booksResponse = await axios.get(
            "http://127.0.0.1:8000/get_books_count",
            {
              params: {
                date: formattedDate,
              },
            }
          );
          setCurrentBooksCount(booksResponse.data.total_books);

          const checkinResponse = await axios.get(
            "http://127.0.0.1:8000/get_checkin_count",
            {
              params: {
                date: formattedDate,
              },
            }
          );
          setCurrentCheckinCount(checkinResponse.data.total_checkin);

          const borrowedBooksResponse = await axios.get(
            "http://127.0.0.1:8000/get_borrow_book_count",
            {
              params: {
                date: formattedDate,
              },
            }
          );
          setCurrentBorrowedBooksCount(
            borrowedBooksResponse.data.total_borrow_book
          );
        }
      } catch (error) {
        console.error("Error fetching current data:", error);
      }
    };

    getCurrentData();
    getBooksCount();
    getCheckinCount();
    getBorrowedBooksCount();
  }, [selectedDateTime]);
  const calculateGrowth = (currentValue, selectedValue) => {
    if (currentValue !== null && selectedValue !== null) {
      const growth = ((selectedValue - currentValue) / currentValue) * 100;
      const formattedGrowth = Math.abs(growth).toFixed(2); // Làm tròn đến hai chữ số sau dấu thập phân
      const sign = growth >= 0 ? "+" : "-";
      return `${sign}${formattedGrowth}%`;
    }
    return "Loading...";
  };

  const data = {
    books: {
      title: "Total Books",
      amount: booksCount !== null ? booksCount : "Loading...",
      totalQuantity: totalBooksCount !== null ? totalBooksCount : "Loading...",
      icon: <IoBook />,
      growth: calculateGrowth(currentBooksCount, booksCount),
      backgroundColor: "#FFE7E7",
    },
    checkin: {
      title: "Total Checkin",
      amount: checkinCount !== null ? checkinCount : "Loading...",
      growth: calculateGrowth(currentCheckinCount, checkinCount),
      icon: <IoCash />,
      backgroundColor: "#FFE7E7",
    },
    borrow_books: {
      title: "Total Borrowed Books",
      amount: borrowedBooksCount !== null ? borrowedBooksCount : "Loading...",
      growth: calculateGrowth(currentBorrowedBooksCount, borrowedBooksCount),

      icon: <IoBookSharp />,
      backgroundColor: "#B47B84",
    },
  };

  return (
    <div className="card--list">
      {Object.keys(data).map((category, index) => (
        <Cards key={index} data={data[category]} />
      ))}
    </div>
  );
};
export default CardList;
