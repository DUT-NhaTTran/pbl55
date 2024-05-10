import React, { createContext, useState, useContext } from "react";
import "./Noti.css";

// Tạo context cho thông báo
const NotificationContext = createContext();

// Tạo `Provider` cho thông báo
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const onClose = () => {
    setNotification(null);
  };
  // Hàm để hiển thị thông báo với tham số `message` và `type`
  const showNotification = (message, type) => {
    setNotification({ message, type });
    // Thông báo sẽ tự động biến mất sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Giá trị được cung cấp bởi context
  const value = {
    notification,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Hiển thị thông báo nếu có */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="message">{notification.message}</span>
          <button className="close-button-1" onClick={onClose}>
            &times;
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Hàm hook để sử dụng context thông báo
export const useNotification = () => {
  return useContext(NotificationContext);
};
