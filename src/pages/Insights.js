import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import { SidebarContext } from "../SidebarContext";

// Helper to get all unique columns from an array of objects
function getAllColumns(data) {
  const cols = new Set();
  data.forEach((row) => Object.keys(row || {}).forEach((key) => cols.add(key)));
  return Array.from(cols);
}

export default function ManipalDataExport() {
  const [insightsData, setInsightsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPageInsights, setCurrentPageInsights] = useState(1);
  const [currentPageLocations, setCurrentPageLocations] = useState(1);
  const [rowsPerPage] = useState(5);
  const api = localStorage.getItem("API");
  const { isCollapsed, windowWidth } = useContext(SidebarContext);
  const {
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    specialityContext,
    sidebarRating,
  } = useContext(SidebarContext);

  // Map context values to backend keys
  const getFilterPayload = () => ({
    state: contextState || [],
    branch: contextCity || [],
    month: newMonthContext || [],
    speciality: specialityContext || [],
    rating: sidebarRating || [],
    dept: profileType || [],
    // dept: ... // add if you have department filter
  });

  // Fetch data on load and whenever filters change
  useEffect(() => {
    fetchData(getFilterPayload());
    // eslint-disable-next-line
  }, [contextState, contextCity, newMonthContext, profileType, specialityContext, sidebarRating]);

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await axios.post(`${api}/exportOverAllData`, filters);
      if (res.data.success) {
        setInsightsData(res.data.insightsData || []);
        setLocationsData(res.data.locationsData || []);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel (two subsheets)
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(insightsData);
    const ws2 = XLSX.utils.json_to_sheet(locationsData);
    XLSX.utils.book_append_sheet(wb, ws1, "ProfileInsights");
    XLSX.utils.book_append_sheet(wb, ws2, "ProfileCounts");
    XLSX.writeFile(wb, "ManipalData.xlsx");
  };

  // Pagination logic for Insights
  const indexOfLastRowInsights = currentPageInsights * rowsPerPage;
  const indexOfFirstRowInsights = indexOfLastRowInsights - rowsPerPage;
  const currentRowsInsights = insightsData.slice(indexOfFirstRowInsights, indexOfLastRowInsights);
  const totalPagesInsights = Math.ceil(insightsData.length / rowsPerPage);

  // Pagination logic for Locations
  const indexOfLastRowLocations = currentPageLocations * rowsPerPage;
  const indexOfFirstRowLocations = indexOfLastRowLocations - rowsPerPage;
  const currentRowsLocations = locationsData.slice(indexOfFirstRowLocations, indexOfLastRowLocations);
  const totalPagesLocations = Math.ceil(locationsData.length / rowsPerPage);

  const handlePrevPageInsights = () => {
    if (currentPageInsights > 1) setCurrentPageInsights(currentPageInsights - 1);
  };
  const handleNextPageInsights = () => {
    if (currentPageInsights < totalPagesInsights) setCurrentPageInsights(currentPageInsights + 1);
  };
  const handlePrevPageLocations = () => {
    if (currentPageLocations > 1) setCurrentPageLocations(currentPageLocations - 1);
  };
  const handleNextPageLocations = () => {
    if (currentPageLocations < totalPagesLocations) setCurrentPageLocations(currentPageLocations + 1);
  };

  // Get all columns for each table
  const insightsColumns = getAllColumns(insightsData);
  const locationsColumns = getAllColumns(locationsData);

  return (
    <div>
      <Navbar />
      <div
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}
      >
        <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-200 min-h-screen">


          {loading ? (
            <div className="text-center text-lg text-gray-600 py-10">Loading....</div>
          ) : (
            <div className="space-y-10">
              {/* Insights Table */}
              <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-gray-700 font-semibold">
                    Profile Insights ({insightsData.length} records)
                  </h2>
                  <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 shadow"
                    disabled={insightsData.length === 0 && locationsData.length === 0}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-xl overflow-hidden border border-gray-200">
                    <thead className="bg-gray-100 text-center">
                      <tr>
                        {insightsColumns.map((key) => (
                          <th key={key} className="font-normal text-[0.9rem] text-gray-700 p-2">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRowsInsights.length > 0 ? (
                        currentRowsInsights.map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                          >
                            {insightsColumns.map((col, i) => (
                              <td key={i} className="font-normal text-[0.9rem] text-gray-700 p-2 border-t text-center">
                                {row[col] !== undefined ? row[col].toString() : ""}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="font-normal text-[0.9rem] text-gray-700 p-2 text-center"
                            colSpan={insightsColumns.length}
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {insightsData.length > rowsPerPage && (
                  <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
                    <button
                      onClick={handlePrevPageInsights}
                      disabled={currentPageInsights === 1}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPageInsights} of {totalPagesInsights}
                    </span>
                    <button
                      onClick={handleNextPageInsights}
                      disabled={currentPageInsights === totalPagesInsights}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Locations Table */}
              <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
                <h2 className="text-xl text-gray-700 font-semibold mb-4">
                  Profile Counts ({locationsData.length} records)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-xl overflow-hidden border border-gray-200">
                    <thead className="bg-gray-100 text-center">
                      <tr>
                        {locationsColumns.map((key) => (
                          <th key={key} className="font-normal text-[0.9rem] text-gray-700 p-2">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRowsLocations.length > 0 ? (
                        currentRowsLocations.map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                          >
                            {locationsColumns.map((col, i) => (
                              <td key={i} className="font-normal text-[0.9rem] text-gray-700 p-2 border-t text-center">
                                {row[col] !== undefined ? row[col].toString() : ""}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="font-normal text-[0.9rem] text-gray-700 p-2 text-center"
                            colSpan={locationsColumns.length}
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {locationsData.length > rowsPerPage && (
                  <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
                    <button
                      onClick={handlePrevPageLocations}
                      disabled={currentPageLocations === 1}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPageLocations} of {totalPagesLocations}
                    </span>
                    <button
                      onClick={handleNextPageLocations}
                      disabled={currentPageLocations === totalPagesLocations}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


