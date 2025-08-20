import { useContext, useEffect, useState } from "react";
import { SharedContext } from "../context/SharedContext";
import { SidebarContext } from "../SidebarContext";
import Navbar from "../components/Navbar";

export default function PhoneMetrics() {
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [contextDepartment, setContextDepartment] = useState();
  const [contextSpeciality, setContextSpeciality] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
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

  // ✅ Fetch data on dependency change
  useEffect(() => {
    async function fetchPhoneMetrics() {
      try {
        const response = await fetch(`${api}/phonemetrics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        console.log("📞 Phone Metrics Response:", data);

        // ✅ Normalize API result
        const rows =
          data?.result ||
          data?.countOfProfiles ||
          data?.data ||
          [];

        // ✅ Update immediately + reset pagination
        setLocationProfiles(rows);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching phone metrics:", err);
      }
    }

    fetchPhoneMetrics();
  }, [
    JSON.stringify(contextState),
    JSON.stringify(contextCity),
    JSON.stringify(newMonthContext),
    JSON.stringify(profileType),
    JSON.stringify(specialityContext),
    JSON.stringify(contextSpeciality),
    sidebarRating
  ]);

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = locationProfiles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(locationProfiles.length / rowsPerPage);

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
        className="p-6"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}
      >
        {/* Table */}
        <table className="w-full border-collapse border border-gray-200 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Unit</th>
              <th className="border p-3">Specialty</th>
              <th className="border p-3">Phone number</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index} className="text-center">
                {/* ✅ Match API fields safely */}
                <td className="border p-2">{row.name || row.Name || "-"}</td>
                <td className="border p-2">{row.unit || row["Unit Name"] || "-"}</td>
                <td className="border p-2">{row.speciality || row.Speciality || "-"}</td>
                <td className="border p-2">{row.phone || row.Phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </SharedContext.Provider>
  );
}
