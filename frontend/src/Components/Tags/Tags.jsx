import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "../Tags/Tags.css";

export default function Tags() {
    const [categories, setCategories] = useState([]); 

    useEffect(() => {
    async function fetchData() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/get_tags');
            const data = response.data;
            
            // Kiểm tra dữ liệu trả về và cập nhật state
            if (data && Array.isArray(data.tags)) {
                setCategories(data.tags);
            } else {
                console.error("Unexpected response format:", data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    fetchData();
}, []);

return (
  <div>
      <h2 className="tags-title">Tags</h2>
      <div className="tags-flex">
          {categories.map((category, index) => (
              <button key={index} className="btns">
                  {category.text} {/* Hiển thị giá trị text của category */}
              </button>
          ))}
      </div>
  </div>
);
}
