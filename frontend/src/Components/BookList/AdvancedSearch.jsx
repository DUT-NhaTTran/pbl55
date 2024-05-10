import React, { useState } from "react";
import "../BookList/BookList.css";
function AdvancedSearch({ onSearch }) {
    const [tag, setTag] = useState("");
    const [author, setAuthor] = useState("");
    const [publicationDateRange, setPublicationDateRange] = useState({ start: "", end: "" });
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng của thanh tìm kiếm nâng cao

    const handleSearch = () => {
        const searchParams = {
            tag,
            author,
            publicationDateRange,
        };
        onSearch(searchParams);
    };

    // Chuyển đổi trạng thái mở/đóng khi người dùng nhấp vào nút
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="advanced-search-container">
            <div className="advanced-search-header">
                {/* Nút để mở/đóng thanh tìm kiếm nâng cao */}
                <button onClick={toggleOpen}>
                    {isOpen ? "Ẩn tìm kiếm nâng cao" : "Hiển thị tìm kiếm nâng cao"}
                </button>
            </div>
            <div className={`advanced-search-fields ${isOpen ? "open" : "closed"}`}>
                <div className="search-field">
                    <label>Tag:</label>
                    <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} />
                </div>
                <div className="search-field">
                    <label>Tác giả:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="search-field">
                    <label>Ngày phát hành:</label>
                    <input
                        type="date"
                        placeholder="Từ"
                        value={publicationDateRange.start}
                        onChange={(e) =>
                            setPublicationDateRange({ ...publicationDateRange, start: e.target.value })
                        }
                    />
                    <input
                        type="date"
                        placeholder="Đến"
                        value={publicationDateRange.end}
                        onChange={(e) =>
                            setPublicationDateRange({ ...publicationDateRange, end: e.target.value })
                        }
                    />
                </div>
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
        </div>
    );
}

export default AdvancedSearch;
