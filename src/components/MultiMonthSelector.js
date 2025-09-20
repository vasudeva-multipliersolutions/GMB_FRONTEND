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
        <div className="multi-select" ref={dropdownRef} style={{ position: "relative",  }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    border: "1px solid #ccc",
                    fontSize: "0.9rem",
                    color: "rgb(55 65 81 / var(--tw-text-opacity, 1))",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minWidth: "18vh",
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
                        minWidth: "150px", // more reliable width
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        maxHeight: "250px", // so dropdown doesn't overflow
                        overflowY: "auto",
                        zIndex: 999,
                        marginTop: "4px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" // optional for nicer look 
                    }}
                >
                    
                    <div style={{ padding: "10px" }}>
                        {/* Month Options */}
                        {filteredMonths
                            .filter((m) => typeof m === "string" && m.trim() !== "")
                            .map((month, idx) => (
                                <label
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "6px 8px",
                                        fontSize: "0.8rem",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        value={month}
                                        checked={selectedMonths.includes(month)}
                                        onChange={() => toggleMonth(month)}
                                        style={{
                                            marginRight: "8px",
                                            width: "16px",
                                            height: "16px"
                                        }}
                                    />
                                    <span style={{ flex: 1, color: "#333" }}>{month}</span>
                                </label>
                            ))}


                        {/* Clear All Option */}
                        <div
                            onClick={() => setSelectedMonths([])}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                textAlign: "center",
                                color: "#EF5F80",
                                fontWeight: "bold",
                                borderTop: "1px solid #eee",
                                fontSize: "14px"
                            }}
                        >
                            Clear All
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};


export default MultiMonthSelector;
