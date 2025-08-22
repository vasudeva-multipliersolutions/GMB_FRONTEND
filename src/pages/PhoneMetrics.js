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

  const { isCollapsed, windowWidth } = useContext(SidebarContext);

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
          setCurrentPage(1);
        }
      } catch (error) {
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

      <div className="p-4"style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
        <h2 className="text-xl text-gray-700 font-semibold mb-4">Phone Metrics</h2>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
       <>
  {/* Table */}
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
      {currentRows.length > 0 ? (
        currentRows.map((item, index) => (
          <tr
            key={item.id}
            className="text-center cursor-pointer hover:bg-gray-100"
          >
            <td className="font-normal text-[0.9rem] text-gray-700 p-2">
              {indexOfFirstRow + index + 1}
            </td>
            <td className="font-normal text-[0.9rem] text-gray-700 p-2">
              {item.name}
            </td>
            <td className="font-normal text-[0.9rem] text-gray-700 p-2">
              {item.unit}
            </td>
            <td className="font-normal text-[0.9rem] text-gray-700 p-2">
              {item.speciality}
            </td>
            <td className="font-normal text-[0.9rem] text-gray-700 p-2">
              {item.phone}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            className="font-normal text-[0.9rem] text-gray-700 p-2 text-center"
            colSpan="5"
          >
            No data available
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* Pagination Controls */}
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
