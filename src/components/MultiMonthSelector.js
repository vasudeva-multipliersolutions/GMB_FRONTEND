import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MultiMonthSelector = ({ filteredMonths, selectedMonths, setSelectedMonths }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMonth = (month) => {
        setSelectedMonths((prev) =>
            prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="multi-select" ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "4px",
                    cursor: "pointer",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minWidth: "15vh",

                }}
            >
                <span>{selectedMonths.length > 0 ? selectedMonths.join(", ") : "Select Months"}</span>
                <span className="ms-2">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "15vh",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        overflowY: "auto",
                        zIndex: 999,
                        marginTop: "4px"
                    }}
                >
                 

                    {/* Month Options */}
                    {filteredMonths.map((month, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", padding: "5px 10px" }}>
                            <input
                                type="checkbox"
                                value={month}
                                checked={selectedMonths.includes(month)}
                                onChange={() => toggleMonth(month)}
                                style={{ marginRight: "8px" }}
                            />
                            <span>{month}</span>
                        </div>
                    ))}
                       {/* Clear All Option */}
                    <div
                        onClick={() => setSelectedMonths([])}
                        style={{
                            padding: "5px 10px",
                            cursor: "pointer",
                            textAlign: "center",
                            color: "#EF5F80",
                            borderTop: "1px solid #eee"
                        }}
                    >
                        Clear All
                    </div>
                </div>
            )}

        </div>
    );
};


export default MultiMonthSelector;
