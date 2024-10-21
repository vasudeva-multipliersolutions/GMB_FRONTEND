import React, { useEffect, useState, useContext } from "react";
import "../stylesheets/docreport.css";
import TableComponent from "../components/TableComponent";
import { SharedContext } from "../context/SharedContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { SidebarContext } from "../SidebarContext";

export default function BasicDetailsComponent() {
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insightdata, setInsightData] = useState(null);

  const { getDrName, getInsightState, getInsightsCity, contextHospitals } = useContext(SharedContext);
  const api = localStorage.getItem("API");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);

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
  }, [getDrName]);

  // Fetch filtered data when getInsightState or getInsightsCity changes
  useEffect(() => {
    async function fetchDataFilter() {
      if (contextHospitals) {
        try {
          const response = await fetch(`${api}/datafilter`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              //state: getInsightState,
              branch: contextHospitals,
            }),
          });
          const data = await response.json();
          setInsightData(data);
          if (contextHospitals.length > 0) {
            setIsLoading(false);
          }
          // setIsLoading(false)
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      }
    }
    fetchDataFilter();
  }, [contextHospitals]);

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

  // Function to download PDF
  const downloadPDF = () => {
    const input = document.querySelector("#capture");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
  
      // Set the margins to 0
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
        null,
        'FAST' // Optional: Use 'FAST' to speed up the rendering
      );
  
      pdf.save("docreport.pdf");
    });
  };
  

  return (
    <>
      {isLoading ? (
        <div>
          {/* <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" /> */}
        </div>
      ) : (
        (getDrName || getInsightState || getInsightsCity) && (
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
                    <button className="download-btn" onClick={downloadPDF}>
                      Download Report
                    </button>
                  </div>
                </div>
                {rows.length > 0 && (
                  <TableComponent
                    bcolor="white"
                    title="Monthly Improvement Report"
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
              <div className="maniContainer p-3 m-3">
                <div className="details">
                  <div className="p-2 download">
                    <button className="download-btn" onClick={downloadPDF}>
                      Download Report
                    </button>
                  </div>
                </div>
                {rows.length > 0 && (
                  <TableComponent
                    bcolor="white"
                    title="Monthly Improvement Report"
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
            )}
          </div>
        )
      )}
    </>
  );
}
