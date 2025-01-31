import React, { useEffect, useState, useContext } from "react";
import "../stylesheets/docreport.css";
import TableComponent from "../components/TableComponent";
import { SharedContext } from "../context/SharedContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SidebarContext } from "../SidebarContext";
import * as XLSX from "xlsx";

export default function BasicDetailsComponent() {
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insightdata, setInsightData] = useState(null);
  const [downloadExcel, setDownloadExcel] = useState(false);

  const { getDrName, getInsightState, getInsightsCity, contextHospitals, setDrName} =
    useContext(SharedContext);
  const api = localStorage.getItem("API");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);




  useEffect(() => {
    if (contextHospitals) {
      setDrName(null); // Reset getDrName to null
      setDocData(null);
    }
  }, [contextHospitals, setDrName]);


  // Fetch doctor data when getDrName changes
  useEffect(() => {
    if (getDrName) {
      async function fetchDocData() {
        try {
          const response = await fetch(`${api}/docData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ businessName: getDrName }),
          });
          const data = await response.json();
          setDocData(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      }
      fetchDocData();
    }
  }, [getDrName,api]);

  // Fetch filtered data when getInsightState or getInsightsCity changes
  useEffect(() => {
    async function fetchDataFilter() {
     // console.log("789: : " + getInsightState);
      const location = contextHospitals ? contextHospitals : getInsightsCity;
      const cluster = contextHospitals ? "" : getInsightState;

      if (getInsightState || getInsightsCity || contextHospitals) {
        try {
          const response = await fetch(`${api}/datafilter`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              state: cluster,
              branch: location,
            }),
          });
          const data = await response.json();
          setInsightData(data);
          if (
            contextHospitals.length > 0 ||
            getInsightState > 0 ||
            getInsightsCity > 0
          ) {
            setIsLoading(false);
          }
          // setIsLoading(false)
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      }
    }
    fetchDataFilter();
  }, [getInsightsCity, getInsightState, contextHospitals, api]);

  // Handle loading state
  // useEffect(() => {
  //   if (docData || insightdata) {
  //     setIsLoading(false);
  //   }
  // }, [docData, insightdata]);

  // Prepare rows for TableComponent
  const rows = docData?.result
    ? [docData.result]
    : insightdata
    ? [insightdata]
      : [];
  
    
     const percentagerow=[
      [
          "May",
          "0.00%",
         "0.00%",
         "0.00%",
          "0.00%",
          "0.00%",
         "0.00%",
         "0.00%",
      ],
      [
          "June",
         "0.00%",
          "0.00%",
         "0.00%",
         "0.00%",
         "0.00%",
          "0.00%",
         "0.00%",
      ],
      [
          "July",
          "0.00%",
         "0.00%",
          "0.00%",
          "0.00%",
          "0.00%",
          "0.00%",
          "0.00%",
      ],
      [
          "August",
         "0.00%",
         "0.00%",
         "0.00%",
          "0.00%",
         "0.00%",
          "0.00%",
          "0.00%",
      ],
      [
          "September",
          "0.00%",
          "0.00%",
         "0.00%",
          "0.00%",
         "0.00%",
         "0.00%",
          "0.00%",
      ],
      [
          "October",
          "0.00%",
         "0.00%",
         "0.00%",
          "0.00%",
         "0.00%",
          "0.00%",
         "0.00%",
      ]
  ]

  // Function to download PDF
  const downloadPDF = () => {
    const input = document.querySelector("#capture"); // The DOM element to capture
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Original dimensions of the canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the scaling ratio to fit the content into the PDF page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      // Adjust the image position and size
      const imgX = (pdfWidth - imgWidth * ratio) / 2; // Horizontally centered
      const imgY = 0; // Start at the top of the page

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
        null,
        "FAST" // Use 'FAST' to speed up rendering
      );

      pdf.save("insights.pdf"); // Save the PDF
    });
  };


  const exportToExcel = () => {
    // Define the header
    const head = [
      "Month",
      "GS - Mobile",
      "GS - Desktop",
      "GM - Mobile",
      "GM - Desktop",
      "Website Clicks",
      "Directions Clicks",
      "Phone Calls",
    ];
  
    // Ensure rows have data
    if (!rows || rows.length === 0) {
      console.warn("No data available to export.");
      return; // Exit if there's no data to export
    }
  
    // Flatten the rows if needed and include headers
    const worksheetData = [head, ...rows.flat()];
  
    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
  
    // Generate an Excel file and trigger a download
    XLSX.writeFile(wb, "MonthlyImprovementReport.xlsx");
  };
  

  return (
    <>
      {isLoading ? (
        <div>
          {/* Uncomment the below lines for loading shimmer */}
          {/* <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" /> */}
        </div>
      ) : (
        (getDrName || getInsightState || getInsightsCity || contextHospitals) && (
          <div
            id="capture"
            style={{
              marginLeft:
                windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
              transition: "margin-left 0.5s ease",
            }}
          >
            {docData ? (
              <div className="maniContainer p-3 m-3">
                <div className="details">
                  <div className="basi-details">
                    <div className="head p-2">
                      <span>Dr Name: </span>
                      <br />
                      <span>Dr Mobile: </span>
                    </div>
                    <div className="content p-2">
                      {docData?.finalDetails?.[0] && (
                        <>
                          <span>{docData.finalDetails[0].name}</span>
                          <br />
                          <span>{docData.finalDetails[0].phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-2 download">
                    <button
                      className="download-btn"
                      onClick={() => setIsPopupOpen(true)}
                    >
                      Download Report
                    </button>
                  </div>
                </div>
                {rows.length > 0 && (
                  <TableComponent
                    bcolor="white"
                    title="Monthly Improvement Report"
                    downloadExcel={downloadExcel}
                    setDownloadExcel={setDownloadExcel}
                    head={[
                      "Month",
                      "GS - Mobile",
                      "GS - Desktop",
                      "GM - Mobile",
                      "GM - Desktop",
                      "Website Clicks",
                      "Directions Clicks",
                      "Phone Calls",
                    ]}
                    rows={rows}
                  />
                )}
              </div>
            ) : (
              // Else condition with two tables
              <div className="maniContainer p-3 m-3">
                <div className="details">
                  <div className="p-2 download">
                    <button
                      className="download-btn"
                      onClick={() => setIsPopupOpen(true)}
                    >
                      Download Report
                    </button>
                  </div>
                </div>
  
                {/* First Table */}
                {rows.length > 0 && (
                  <TableComponent
                    bcolor="white"
                    title="Monthly Improvement Report (Doctors)"
                    // downloadExcel={downloadExcel}
                    // setDownloadExcel={setDownloadExcel}
                    head={[
                      "Month",
                      "GS - Mobile",
                      "GS - Desktop",
                      "GM - Mobile",
                      "GM - Desktop",
                      "Website Clicks",
                      "Directions Clicks",
                      "Phone Calls",
                    ]}
                    rows={rows}
                  />
                )}
  
                {/* Second Table */}
                    {rows.length > 0 && (
                      <div className="mt-5">
                  <TableComponent
                    bcolor="white"
                    title="Monthly Improvement Percentage - (Hospitals)"
                    downloadExcel={downloadExcel}
                    setDownloadExcel={setDownloadExcel}
                    head={[
                      "Month",
                      "GS - Mobile",
                      "GS - Desktop",
                      "GM - Mobile",
                      "GM - Desktop",
                      "Website Clicks",
                      "Directions Clicks",
                      "Phone Calls",
                    ]}
                    rows={[percentagerow]}
                        />
                        </div>
                )}
              </div>
            )}
          </div>
        )
      )}
  
      {/* Popup */}
      {isPopupOpen && (
        <Popup
          downloadPDF={downloadPDF}
          exportToExcel={ exportToExcel}
          setDownloadExcel={setDownloadExcel}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
  
}

const Popup = ({ setDownloadExcel, exportToExcel,downloadPDF, onClose }) => (
  <div
    className="modal fade show d-flex justify-content-center align-items-center"
    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    tabIndex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-primary" id="modalLabel">
            Download PDF/Excel
          </h5>
          {/* <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button> */}
        </div>
        <div className="modal-body text-center">
          <div className="d-grid gap-2">
            {/* CSV Button */}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                downloadPDF();
                onClose();
              }} // Handle CSV selection
            >
              <i class="bi bi-filetype-pdf"></i>
              PDF
            </button>
            {/* Excel Button */}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                //setDownloadExcel(true);
                exportToExcel();
                onClose();
              }} // Handle Excel selection
            >
              <i class="bi bi-file-earmark-excel"></i>
              Excel
            </button>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-center">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);
