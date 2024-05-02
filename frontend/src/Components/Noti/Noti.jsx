import React from 'react';
import "../Noti/Noti.css";

const Notification = ({ message, type, onClose }) => {
    // Lựa chọn lớp CSS dựa trên loại thông báo (success, error, info)
    const notificationClass = `notification ${type}`;

    return (
        <div className={notificationClass}>
            <span className="message">{message}</span>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default Notification;
