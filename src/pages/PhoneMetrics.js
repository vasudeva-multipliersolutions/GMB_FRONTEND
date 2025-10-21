import { useContext, useEffect, useState } from "react";
import { SharedContext } from "../context/SharedContext";
import { SidebarContext } from "../SidebarContext";
import Navbar from "../components/Navbar";

export default function PhoneMetrics() {
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [contextDepartment, setContextDepartment] = useState();
  const [contextSpeciality, setContextSpeciality] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const api = localStorage.getItem("API");

  const {
    contextState,
    contextCity,
    newMonthContext,
    profileType,
    specialityContext,
    sidebarRating,
    isCollapsed,
    windowWidth
  } = useContext(SidebarContext);

  // ✅ Export function to download data as CSV
  const exportToCSV = () => {
    if (locationProfiles.length === 0) {
      alert("No data available to export");
      return;
    }

    const sortedData = [...locationProfiles].sort((a, b) => a.unit.localeCompare(b.unit));
    const headers = ["S.No", "Name", "Unit", "Speciality", "Phone"];

    const csvContent = [
      headers.join(","),
      ...sortedData.map((item, index) =>
        [
          index + 1,
          `"${item.name}"`,
          `"${item.unit}"`,
          `"${item.speciality}"`,
          `"${item.phone}"`
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const date = new Date().toISOString().split("T")[0];
      const filters = [contextState, contextCity, newMonthContext, profileType]
        .filter(Boolean)
        .join("_");

      const filename = `phone_metrics_${filters}_${date}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ✅ FIXED EFFECT — NO MORE FLASHING ISSUE
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPhoneMetrics() {
      try {
        const hasValidFilters = contextState || contextCity || newMonthContext;

        if (!hasValidFilters) {
          if (isMounted) {
            setLocationProfiles([]);
            setLoading(false);
          }
          return;
        }

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
            rating: sidebarRating,
          }),
        });

        const data = await response.json();

        if (isMounted) {
          setLocationProfiles(data?.result || []);
          setCurrentPage(1);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching phone metrics:", error);
          if (isMounted) setLocationProfiles([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

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

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

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

      <div
        className="p-4"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-700 font-semibold">Phone Metrics</h2>

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

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <table className="w-full rounded-xl overflow-hidden border border-gray-200">
              <thead className="bg-gray-100 text-center">
                <tr>
                  <th className="p-2 text-gray-700 text-sm">S.No</th>
                  <th className="p-2 text-gray-700 text-sm">Name</th>
                  <th className="p-2 text-gray-700 text-sm">Unit</th>
                  <th className="p-2 text-gray-700 text-sm">Speciality</th>
                  <th className="p-2 text-gray-700 text-sm">Phone</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  [...currentRows]
                    .sort((a, b) => a.unit.localeCompare(b.unit))
                    .map((item, index) => (
                      <tr key={index} className="text-center hover:bg-gray-100">
                        <td className="p-2 text-sm text-gray-700">
                          {indexOfFirstRow + index + 1}
                        </td>
                        <td className="p-2 text-sm text-gray-700">{item.name}</td>
                        <td className="p-2 text-sm text-gray-700">{item.unit}</td>
                        <td className="p-2 text-sm text-gray-700">{item.speciality}</td>
                        <td className="p-2 text-sm text-gray-700">{item.phone}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center text-gray-700">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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
        )}
      </div>
    </SharedContext.Provider>
  );
}
