import React from 'react';
import "./Container.css";

const ChartContainer = ({ children }) => {
  return (
    <div className='chart-container'>{children}</div>
  );
};

export default ChartContainer;
