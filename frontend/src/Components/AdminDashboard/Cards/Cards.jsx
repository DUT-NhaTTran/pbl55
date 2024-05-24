import React from "react";
import "./Cards.css";
import CountUp from "react-countup";

export default function Cards({ data }) {
  const { title, amount, totalQuantity, growth, icon, backgroundColor } = data;

  // Determine if the title indicates a numeric amount
  const isNumericAmount =
    title === "Total Books" ||
    title === "Total Checkin" ||
    title === "Total Borrowed Books";

  // Parse the numeric amount if applicable
  const numericAmount = isNumericAmount
    ? parseFloat(amount)
    : amount;

  // Determine if a dollar sign should be displayed
  const displayDollarSign =
    title === "Total Book" || title === "Total Checkin";

  // Determine the unit based on the title
  const unit = title === "Total Checkin" ? "turns" : "books";

  return (
    <div className="card" style={{ backgroundColor }}>
      <div className="card--header">
        <div className="card--icon" style={{ color: backgroundColor }}>
          {icon}
        </div>
        <div className="card--body">
          <h2 className="amount">
            <CountUp
              start={0}
              end={numericAmount}
              duration={2}
              separator=","
            />
            {isNumericAmount && ` ${unit}`}
          </h2>
          <div className="growth">
            <p>{title}</p>
            <span>{growth}</span>
          </div>
          {title === "Total Books" && ( // Hiển thị total_quantity nếu title là Total Books
            <p>Total Quantity: {totalQuantity}</p>
          )}
        </div>
      </div>
    </div>
  );
}
