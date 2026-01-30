import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const monthsAll = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const MultiMonthSelector = ({
  filteredMonths = [],       // optional array of month strings to show (subset)
  selectedMonths = [],
  setSelectedMonths,
  selectedYear               // pass the year (number or string) selected by user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // compute which months to display (keep original order Jan..Dec)
  const displayMonths =
    Array.isArray(filteredMonths) && filteredMonths.length > 0
      ? monthsAll.filter((m) => filteredMonths.includes(m))
      : monthsAll;

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth(); // 0-based (0 = Jan)
  const previousMonthIndex = currentMonthIndex - 1; // if Oct (9) => prev = 8 (Sep)

  const isMonthDisabled = (month) => {
    // if no selectedYear provided, default behaviour: allow months up to previous month of current year
    if (!selectedYear && typeof selectedYear !== "number") {
      return previousMonthIndex < 0 ? false : monthsAll.indexOf(month) > previousMonthIndex;
    }

    const selYearNum = Number(selectedYear);
    if (isNaN(selYearNum)) return false;

    if (selYearNum < currentYear) return false; // past years => all enabled
    if (selYearNum > currentYear) return true;  // future years => all disabled

    // selectedYear === currentYear
    if (previousMonthIndex < 0) return true; // current month is Jan -> no selectable months
    return monthsAll.indexOf(month) > previousMonthIndex;
  };

  // toggle but ignore if disabled
  const toggleMonth = (month) => {
    if (isMonthDisabled(month)) return;
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  // when selectedYear or filteredMonths changes, remove any selected months that are now disabled
  useEffect(() => {
    if (typeof setSelectedMonths !== "function") return;
    setSelectedMonths((prev = []) => prev.filter((m) => displayMonths.includes(m) && !isMonthDisabled(m)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, JSON.stringify(filteredMonths)]);

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
    <div className="multi-select" ref={dropdownRef} style={{ position: "relative" }}>
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
            minWidth: "150px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 999,
            marginTop: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div style={{ padding: "10px" }}>
            {displayMonths
              .filter((m) => typeof m === "string" && m.trim() !== "")
              .map((month, idx) => {
                const disabled = isMonthDisabled(month);
                return (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 8px",
                      fontSize: "0.8rem",
                      cursor: disabled ? "not-allowed" : "pointer",
                      color: disabled ? "#a0a0a0" : "#333",
                      opacity: disabled ? 0.6 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      value={month}
                      checked={selectedMonths.includes(month)}
                      onChange={() => toggleMonth(month)}
                      disabled={disabled}
                      style={{
                        marginRight: "8px",
                        width: "16px",
                        height: "16px",
                        cursor: disabled ? "not-allowed" : "pointer"
                      }}
                    />
                    <span style={{ flex: 1 }}>{month}</span>
                  </label>
                );
              })}

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
