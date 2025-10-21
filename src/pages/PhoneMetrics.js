import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../SidebarContext";
import { SharedContext } from "../context/SharedContext";
import Navbar from "../components/Navbar";

export default function PhoneMetrics() {
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [contextDepartment, setContextDepartment] = useState();
  const [contextSpeciality, setContextSpeciality] = useState();
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const api = localStorage.getItem("API");

  const {
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    specialityContext,
    sidebarRating,
    isCollapsed,
    windowWidth,
    phoneMetricsData,
    setPhoneMetricsData,
  } = useContext(SidebarContext);

  // Fetch data whenever any filter changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPhoneMetrics() {
      try {
        if (isMounted) setLoading(true);

        const body = {
          state: contextState || [], // empty array if no filter
          branch: contextCity || [],
          dept: profileType || [],
          speciality: specialityContext || [],
          rating: sidebarRating || "",
          month: newMonthContext || "", // backend will default to "Jul"
        };

        const response = await fetch(`${api}/phonemetrics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (isMounted) {
          if (data.success && data.result) {
            setPhoneMetricsData(data.result); // save globally
          } else {
            setPhoneMetricsData([]);
          }
          setHasFetched(true);
          setCurrentPage(1); // reset pagination on new fetch
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching phone metrics:", error);
          if (isMounted) setPhoneMetricsData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPhoneMetrics();

    return () => controller.abort();
  }, [
    api,
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    specialityContext,
    sidebarRating,
    setPhoneMetricsData,
  ]);

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = phoneMetricsData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(phoneMetricsData.length / rowsPerPage);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Export CSV
  const exportToCSV = () => {
    if (!phoneMetricsData.length) return alert("No data to export");

    const headers = ["S.No", "Name", "Unit", "Speciality", "Phone"];
    const csvContent = [
      headers.join(","),
      ...phoneMetricsData.map((item, i) =>
        [i + 1, `"${item.name}"`, `"${item.unit}"`, `"${item.speciality}"`, `"${item.phone}"`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toISOString().split("T")[0];
    link.download = `phone_metrics_${date}.csv`;
    link.click();
  };

  // Table content
  const renderTableContent = () => {
    if (loading) return <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>;
    if (!hasFetched) return <tr><td colSpan="5" className="text-center py-4 text-gray-500">Fetching data...</td></tr>;
    if (!phoneMetricsData.length) return <tr><td colSpan="5" className="text-center py-4 text-gray-500">No data available</td></tr>;

    return currentRows
      .sort((a, b) => a.unit.localeCompare(b.unit))
      .map((item, index) => (
        <tr key={`${item.name}-${item.unit}-${index}`} className="text-center hover:bg-gray-100">
          <td className="p-2">{indexOfFirstRow + index + 1}</td>
          <td className="p-2">{item.name}</td>
          <td className="p-2">{item.unit}</td>
          <td className="p-2">{item.speciality}</td>
          <td className="p-2">{item.phone}</td>
        </tr>
      ));
  };

  return (
    <>
    <SharedContext.Provider
      value={{
        locationProfiles,
        setLocationProfiles,
        contextDepartment,
        setContextDepartment,
        contextSpeciality,
        setContextSpeciality,
      }}
    >
      <Navbar />
      <div
        className="p-4"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Phone Metrics</h2>
          <button
            onClick={exportToCSV}
            disabled={!phoneMetricsData.length || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Export Data ({phoneMetricsData.length})
          </button>
        </div>

        {/* Table */}
        <table className="w-full border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="p-2">S.No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Speciality</th>
              <th className="p-2">Phone</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>

        {/* Pagination */}
        {phoneMetricsData.length > rowsPerPage && (
          <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
      </SharedContext.Provider>
    </>
  );
}
