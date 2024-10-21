import React, { useEffect, useState, useContext } from "react";
import "../stylesheets/docreport.css";
import TableComponent from "../components/TableComponent";
import { SharedContext } from "../context/SharedContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { SidebarContext } from "../SidebarContext";
import DoctorTableComponent from "../components/DoctorTableComponent";

export default function TopDOctorDetails() {
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insightdata, setInsightData] = useState(null);
  

  const { getDrName, getInsightState, getInsightsCity } =
        useContext(SharedContext);
    
  const api = localStorage.getItem("API");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);

    useEffect(() => { 
       // console.log("getInsightState" + getInsightState + "getInsighCity : " + getInsightsCity);
    })
    
  // Fetch doctor data when getDrName changes
//   useEffect(() => {
//     if (getDrName) {
//       async function fetchDocData() {
//         try {
//           const response = await fetch(`${api}/docData`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ businessName: getDrName }),
//           });
//           const data = await response.json();
//           setDocData(data);
//           setIsLoading(false);
//         } catch (error) {
//           console.error("Error fetching doctor data:", error);
//         }
//       }
//       fetchDocData();
//     }
//   }, [getDrName]);

    // Fetch filtered data when getInsightState or getInsightsCity changes
 
    

  useEffect(() => {
    async function fetchDataFilter() {
      if (getInsightState || getInsightsCity) {
        try {
          const response = await fetch(`${api}/topdoc`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              state: getInsightState,
              branch: getInsightsCity,
            }),
          });
          const data = await response.json();
          setInsightData(data);
          if (getInsightState.length > 0 || getInsightsCity.length > 0) {
            setIsLoading(false);
          }
          // setIsLoading(false)
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      }
    }
    fetchDataFilter();
  }, [getInsightState, getInsightsCity]);
    
    
       
  useEffect(() => {
    async function fetchTopDocdata() {
     
        try {
          const response = await fetch(`${api}/topdoc`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            
          });
          const data = await response.json();
          setInsightData(data);
       
           setIsLoading(false)
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      
    }
    fetchTopDocdata();
}, []);

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
                windowWidth > 768 ? (isCollapsed ? "8%" : "20%") : 0,
                width:
                windowWidth > 768 ? (isCollapsed ? "91.5%" : "80%") : 0,
                transition: "margin-left 0.5s ease",
            }}
          >
            {docData ? (
              <div className="maniContainer p-3 ">
                
                {rows.length > 0 && (
                  <DoctorTableComponent
                    bcolor="white"
                    title="Monthly Improvement Report"
                    head={[
                      "Dr. Name",
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
              <div className="maniContainer p-2">
                {/* <div className="details">
                  <div className="p-2 download">
                    <button className="download-btn" onClick={downloadPDF}>
                      Download Report
                    </button>
                  </div>
                </div> */}
                {rows.length > 0 && (
                  <DoctorTableComponent
                    bcolor="white"
                    title="Monthly Improvement Report"
                    head={[
                      "Dr. Name",
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
