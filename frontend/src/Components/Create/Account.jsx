import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import axios from "axios";
import Notification from "../Noti/Noti";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const showNotification = (message, type) => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };
    const handleSave = () => {
        if (password !== reenterPassword) {
            showNotification("Passwords do not match",'error');
            return;
        }

        const data = {
            username,
            password,
        };

        axios
            .post("http://127.0.0.1:8000/save_account", data)
            .then((response) => {
                console.log("Account saved successfully:", response.data);
                navigate("/home/create");

            })
            .catch((error) => {
                console.error("Error saving account data:", error);
            });
    };

    return (
        <div>
            <div className="header">Create Account</div>
            <hr className="divider" />
            <div className="profile-form">
                <div className="row">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Re-Enter Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={reenterPassword}
                            onChange={(e) => setReenterPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="button-group">
                    <button type="button" className="btn-save" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="btn-cancel">
                        Cancel
                    </button>
                </div>
            </div>
            {/* Hiển thị thông báo nếu có */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default Account;
