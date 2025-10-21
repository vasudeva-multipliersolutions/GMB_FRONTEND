import { useContext, useEffect, useState } from "react";
import { SharedContext } from "../context/SharedContext";
import { SidebarContext } from "../SidebarContext";
import Navbar from "../components/Navbar";

export default function PhoneMetrics() {
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [contextDepartment, setContextDepartment] = useState();
  const [contextSpeciality, setContextSpeciality] = useState();
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const api = localStorage.getItem("API");

  const {
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    specialityContext,
    sidebarRating
  } = useContext(SidebarContext);

  console.log("contextSpeciality⚔⚔⚔⚔:", contextSpeciality);

  const { isCollapsed, windowWidth } = useContext(SidebarContext);

  // ✅ Export function to download data as CSV
  const exportToCSV = () => {
    if (locationProfiles.length === 0) {
      alert("No data available to export");
      return;
    }

    // Sort data before exporting (same as display)
    const sortedData = [...locationProfiles].sort((a, b) => a.unit.localeCompare(b.unit));

    // Create CSV headers
    const headers = ["S.No", "Name", "Unit", "Speciality", "Phone"];
    
    // Create CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...sortedData.map((item, index) => [
        index + 1,
        `"${item.name}"`, // Wrap in quotes to handle commas in names
        `"${item.unit}"`,
        `"${item.speciality}"`,
        `"${item.phone}"`
      ].join(","))
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      
      // Generate filename with current date and filters
      const date = new Date().toISOString().split('T')[0];
      const filters = [
        contextState,
        contextCity,
        newMonthContext,
        profileType
      ].filter(Boolean).join('_');
      
      const filename = `phone_metrics_${filters}_${date}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ✅ Fetch data with debounce and check for valid filters
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPhoneMetrics() {
      try {
        // ✅ Avoid fetching when filters are empty
        if (!contextState && !contextCity && !newMonthContext) return;

        setLoading(true);

        const response = await fetch(`${api}/phonemetrics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            state: contextState,
            branch: contextCity,
            month: newMonthContext,
            dept: profileType,
            speciality: contextSpeciality || specialityContext,
            rating: sidebarRating
          }),
        });

        const data = await response.json();

        if (isMounted && data.success && data.result) {
          setLocationProfiles(data.result);
          setHasFetchedOnce(true);

          setCurrentPage(1);
        }
      } catch (error) {
        setHasFetchedOnce(true);

        if (error.name !== "AbortError") {
          console.error("Error fetching phone metrics:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // ✅ Debounce fetch to avoid multiple calls during quick changes
    const timeout = setTimeout(fetchPhoneMetrics, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [
    api,
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    contextSpeciality,
    specialityContext,
    sidebarRating
  ]);

  // ✅ Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = locationProfiles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(locationProfiles.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
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

      <div className="p-4" style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
        
        {/* Header with Title and Export Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-700 font-semibold">Phone Metrics</h2>
          
          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={loading || locationProfiles.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
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
            Export Data ({locationProfiles.length} records)
          </button>
        </div>

{/* === Render Logic === */}
{loading ? (
  <div className="text-center py-4">Loading...</div>
) : !hasFetchedOnce ? (
  // ⛔ Nothing has been fetched yet → don’t show anything
  <div className="text-center py-4 text-gray-500">
    Select filters to load phone metrics
  </div>
) : locationProfiles.length > 0 ? (
  <>
    {/* ✅ Table Section */}
    <table className="w-full rounded-xl overflow-hidden border border-gray-200">
      <thead className="bg-gray-100 text-center">
        <tr>
          <th className="font-normal text-[0.9rem] text-gray-700 p-2 rounded-tl-xl">S.No</th>
          <th className="font-normal text-[0.9rem] text-gray-700 p-2">Name</th>
          <th className="font-normal text-[0.9rem] text-gray-700 p-2">Unit</th>
          <th className="font-normal text-[0.9rem] text-gray-700 p-2">Speciality</th>
          <th className="font-normal text-[0.9rem] text-gray-700 p-2 rounded-tr-xl">Phone</th>
        </tr>
      </thead>
      <tbody>
        {[...currentRows]
          .sort((a, b) => a.unit.localeCompare(b.unit))
          .map((item, index) => (
            <tr key={item.id} className="text-center cursor-pointer hover:bg-gray-100">
              <td className="font-normal text-[0.9rem] text-gray-700 p-2">
                {indexOfFirstRow + index + 1}
              </td>
              <td className="font-normal text-[0.9rem] text-gray-700 p-2">{item.name}</td>
              <td className="font-normal text-[0.9rem] text-gray-700 p-2">{item.unit}</td>
              <td className="font-normal text-[0.9rem] text-gray-700 p-2">{item.speciality}</td>
              <td className="font-normal text-[0.9rem] text-gray-700 p-2">{item.phone}</td>
            </tr>
          ))}
      </tbody>
    </table>

    {/* Pagination */}
    {locationProfiles.length > rowsPerPage && (
      <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </>
) : (
  // ✅ Show No Data *only* after first fetch
  <div className="text-center text-gray-500 py-4">No data available</div>
)}


      </div>
    </SharedContext.Provider>
  );
}