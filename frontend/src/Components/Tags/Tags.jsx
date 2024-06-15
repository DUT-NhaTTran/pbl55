import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Tags/Tags.css";
import config from '../../config'; // Import file cấu hình

export default function Tags({ onTagSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${config.apiUrl}/get_tags`);
        setCategories(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="tags-title">Tags</h2>
      <div className="tags-flex">
      <button className="btns" onClick={() => onTagSelect("all")}>All tags</button>

        {categories.map((tag, index) => (
          <button
            key={index}
            className="btns"
            onClick={() => onTagSelect(tag.text)}
          >
            {tag.text}
          </button>
        ))}
      </div>
    </div>
  );
}
