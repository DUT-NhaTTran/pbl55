import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Create/Create.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Noti/Noti";

const CreateCheckin = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [uid, setUid] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [bookId, setBookId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mode, setMode] = useState("");
  const [limitDay, setLimitDay] = useState("");

  const formatTime = (timeString) => {
    return timeString.replace("T", " ").replace("Z", "");
  };

  const handleSave = async () => {
    if (
      !uid ||
      !startDateTime ||
      !endDateTime ||
      !bookId ||
      !quantity ||
      !mode
    ) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    const formattedStartTime = formatTime(startDateTime);
    const formattedEndTime = formatTime(endDateTime);

    const data = {
      uid,
      startDateTime: formattedStartTime,
      endDateTime: formattedEndTime,
      bookId,
      quantity,
      mode,
      limitDay: mode === "Borrow" ? limitDay : null,
    };

    if (formattedStartTime > formattedEndTime) {
      showNotification("Start time must be before end time", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/save_checkin",
        data
      );

      if (response.status === 201) {
        showNotification("Checkin created successfully", "success");
        navigate("/home");
      } else {
        showNotification("Failed to create checkin", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMsg = error.response.data.error;

        switch (errorMsg) {
          case "UID not found in User":
            showNotification("UID not found in User", "error");
            break;
          case "BookId not found in Books":
            showNotification("Book ID not found in Books", "error");
            break;
          case "Not enough books to borrow":
            const availableQuantity = error.response.data.available_quantity;
            showNotification(
              `Not enough books to borrow. Available quantity: ${availableQuantity}`,
              "error"
            );
            break;
          default:
            showNotification("Error: " + errorMsg, "error");
        }
      } else {
        showNotification("Error creating checkin", "error");
      }
    }
  };

  return (
    <div>
      <div className="header">Create Checkin</div>
      <hr className="divider" />
      <div className="profile-form">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">UID:</label>
              <input
                type="text"
                className="form-input"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time-in</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value + ":00")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time-out</label>
              <input
                type="datetime-local"
                className="form-input"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value + ":00")}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Book ID:</label>
              <input
                type="text"
                className="form-input"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Borrow/Return</label>
              <div className="gender-options">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value="Borrow"
                    checked={mode === "Borrow"}
                    onChange={() => setMode("Borrow")}
                  />
                  Borrow
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value="Return"
                    checked={mode === "Return"}
                    onChange={() => setMode("Return")}
                  />
                  Return
                </label>
              </div>
            </div>
            {mode === "Borrow" && (
              <div className="form-group">
                <label className="form-label">Limit Day:</label>
                <input
                  type="number"
                  className="form-input"
                  value={limitDay}
                  onChange={(e) => setLimitDay(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="btn-save" onClick={handleSave}>
            Save
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckin;
