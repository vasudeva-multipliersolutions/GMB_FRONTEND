import React, { useEffect, useState, useContext } from 'react'
import '../stylesheets/docreport.css'
import TableComponent from '../components/TableComponent'
import GraphicalContainer from './GraphicalContainer'
import { SharedContext } from '../context/SharedContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ShimmerThumbnail } from "react-shimmer-effects";
import { ShimmerTitle } from "react-shimmer-effects";
import { SidebarContext } from '../SidebarContext'
import * as XLSX from 'xlsx';


function getLast6MonthsLabels() {
  const now = new Date();
  const labels = [];

  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString("default", { month: "short" }); // e.g. Jan, Feb
    const year = d.getFullYear();
    labels.push({ label: month, year });
  }

  return labels;
}

function reorderGraphData(rawData, isYearSpecific = false) {
  const last6Months = getLast6MonthsLabels().reverse(); // reversed here

  return last6Months.map(({ label, year }) => {
    const rawKey = isYearSpecific ? `${year}-${label}` : label;
    const displayKey = `${label}-${year}`;

    return {
      [displayKey]: rawData[rawKey] || rawData[label] || 0
    };
  }).reduce((acc, cur) => ({ ...acc, ...cur }), {});
}



export default function BasicDetailsComponent() {
  const [docData, setDocData] = useState()
  const { getDrName, setDrName } = useContext(SharedContext)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreloader, setShowPreloader] = useState(false) // <-- added
  const [showErrorOverlay, setShowErrorOverlay] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  var ratingsuggestion = ""
  const api = localStorage.getItem('API')
  const token = localStorage.getItem("token");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { doctorAnalysis, profileType } = useContext(SidebarContext);


  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        setShowPreloader(true); // show overlay immediately
        setShowErrorOverlay(false);
        setErrorMessage("");
        setIsLoading(true); // show loader before request
        const start = Date.now();

        const controller = new AbortController();
        const timeout = 10000; // 10s timeout
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(`${api}/docData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ "businessName": getDrName }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (response.status === 403 || response.status === 404) {
            localStorage.clear();
            window.location.reload();
            return;
          }

          if (!response.ok) {
            setDocData(null);
            setErrorMessage("Data unavailable");
            setShowErrorOverlay(true);
            return;
          }

          const data = await response.json();
          if (!data || Object.keys(data).length === 0 || !data.cRank || data.cRank.length === 0) {
            setDocData(null);
            setErrorMessage("Data unavailable");
            setShowErrorOverlay(true);
          } else {
            setDocData(data);
          }
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("Error fetching docData:", error);
          if (error.name === "AbortError") {
            setErrorMessage("Request timed out. Data unavailable.");
          } else {
            setErrorMessage("Data unavailable");
          }
          setDocData(null);
          setShowErrorOverlay(true);
        } finally {
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, 2000 - elapsed); // ensure at least 2s visible
          await new Promise((res) => setTimeout(res, remaining));
          setIsLoading(false); // hide loader after fetch completes
          setShowPreloader(false); // hide spinner overlay
          // keep showErrorOverlay true so user sees message if there was an error
          if (showErrorOverlay) {
            // auto-hide error overlay after 3s
            setTimeout(() => setShowErrorOverlay(false), 3000);
          }
        }
      }

      getDocData();
    }
  }, [getDrName]);


  // console.log("Doctor Analysis Data-----------45:", doctorAnalysis);

  const doctorHead = [
    "S.No",
    "Doctor / Business",
    "GS - Mobile",
    "GS - Desktop",
    "GM - Mobile",
    "GM - Desktop",
    "Calls",
    "Directions",
    "Website Clicks",
    "Overall Searches"
  ];

  const doctorRows = doctorAnalysis.map((d, index) => [
    index + 1,
    d._id || "-",
    d["Google Search Mobile"] || 0,
    d["Google Search Desktop"] || 0,
    d["Google Maps Mobile"] || 0,
    d["Google Maps Desktop"] || 0,
    d["Calls"] || 0,
    d["Directions"] || 0,
    d["Website Clicks"] || 0,
    d["overallSearches"] || 0
  ]);



  const head = ['Month', "GS - Mobile", "GS - Desktop", "GM - Mobile", "GM - Desktop", "Website Cliks", "Directions Clicks", "Phone Calls"]
  const rows = []
  const cHead = ["S.No: ", "Competitor name"]
  const cRows = []
  const lHead = ["Keywords", "Rank"]
  const lRows = []
  const images = []
  const rr = {}
  const Topreview_head = ['S.No', 'Review']
  const topreview_body = []
  const lestreview_body = []
  if (docData) {
    //console.log(docData)
    rows.push(docData.result)
    cRows.push(docData.cRank)
    lRows.push(docData.keywordsRanking)
    images.push(docData.images)
    if (docData.badreviews.length !== 0 && docData.badreviews[0] != null) {
      if (docData.badreviews[0][1] != null) {
        lestreview_body.push(docData.badreviews)
      }
    }
    if (docData.goodreviews.length !== 0 && docData.goodreviews[0] != null) {
      //console.log(docData.goodreviews[0])
      if (docData.goodreviews[0][1] != null) {
        topreview_body.push(docData.goodreviews)
      }
    }
    if (docData.ratings) {
      rr["1⭐️"] = docData.ratings[0]
      rr["2⭐️"] = docData.ratings[1]
      rr["3⭐️"] = docData.ratings[2]
      rr["4⭐️"] = docData.ratings[3]
      rr["5⭐️"] = docData.ratings[4]
    }
    if (docData.basicDetails) {
      // console.log("inside basicdetails")
      if (docData.basicDetails[0].averageRating > 4) {
        ratingsuggestion = "Keep up the excellent work! 👍"
      }
      else {
        ratingsuggestion = "Need improvement!"
      }
    }
    // if ( lestreview_body )
    // {
    //   alert( lestreview_body.length )  
    //   alert(topreview_body.length)
    // }
  }
  // setTimeout(() => {
  //   setIsLoading(false)
  // }, 2000);



  // const [loader, setLoader] = useState(false);

  // const downloadPDF = () =>{
  //   const input = document.querySelector('#capture')

  //   html2canvas(input).then((canvas)=>{
  //     const imgData = canvas.toDataURL('img/png');
  //     const doc = new jsPDF('p','mm','a4',true);
  //     const docWidth = doc.internal.pageSize.getWidth();
  //     const docHeight = doc.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio =Math.min(docWidth/ imgWidth, docHeight/ imgHeight )
  //     const imgX = (docWidth - imgWidth * ratio)
  //     const imgY = 30;
  //     doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth*ratio, imgHeight*ratio );
  //     doc.addImage(imgData, 'PNG', 0, 0, docWidth, docHeight );

  //     doc.save('./docreport.pdf')
  //   })
  // }
  const downloadPDF = () => {
    const section1 = document.querySelector('#section1'); // Till "See how your GMB profile looks..."
    const section2 = document.querySelector('#section2'); // "Actual search results on google" and "Analytics"
    const section3 = document.querySelector('#section3'); // Remaining content

    const scale = 2; // Higher scale for better quality
    const pdf = new jsPDF('p', 'mm', 'a4'); // PDF instance with A4 size

    const addSectionToPDF = async (element, addPage = false) => {
      if (addPage) pdf.addPage(); // Add a new page if required

      const canvas = await html2canvas(element, { scale });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Scale canvas dimensions to fit the PDF page
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Set imgX for horizontal centering; imgY starts at the top (0)
      const imgX = (pdfWidth - scaledWidth) / 2; // Center horizontally
      const imgY = 0; // Start at the top of the page

      pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
    };

    // Sequentially add each section to the PDF
    addSectionToPDF(section1)
      .then(() => addSectionToPDF(section2, true)) // Add to a new page
      .then(() => addSectionToPDF(section3, true)) // Add to a new page
      .then(() => pdf.save('docreport.pdf')) // Save the PDF
      .catch((error) => console.error('Error generating PDF:', error));
  };


  const exportToExcel = () => {
    const head = [
      "Month",
      "GS - Mobile",
      "GS - Desktop",
      "GM - Mobile",
      "GM - Desktop",
      "Website Clicks",
      "Directions Clicks",
      "Phone Calls"
    ];

    const rows = docData?.result || [];

    if (rows.length === 0) {
      console.warn("No data available to export.");
      return;
    }

    const worksheetData = [head, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Use doctor's name and phone number for filename
    const name = docData?.finalDetails?.[0]?.name?.replace(/\s+/g, '_') || "Doctor";
    const phone = docData?.finalDetails?.[0]?.phone || "NoPhone";

    const filename = `${name}_${phone}_report.xlsx`;

    XLSX.writeFile(wb, filename);
  };


  // useEffect(() => { 
  //   if (downloadExcel) { 
  //     exportToExcel()
  //   }
  // }, [downloadExcel])

  // inside your component (before return):

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDoctorRows = doctorAnalysis.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(doctorAnalysis.length / rowsPerPage);

  return docData && Object.keys(docData).length > 0 ? (
    <>
      {/* Preloader overlay */}
      {showPreloader && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 2000
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              width: 36,
              height: 36,
              border: "4px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <div style={{ fontSize: 16, color: "#111827", fontWeight: 600 }}>Loading...</div>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {/* Error / Unavailable overlay */}
      {showErrorOverlay && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 2000
        }}>
          <div style={{
            background: "#fff",
            padding: "20px 28px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            textAlign: "center",
            maxWidth: "90%"
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Data Unavailable
            </div>
            <div style={{ color: "#374151" }}>{errorMessage || "Unable to load data. Please try again."}</div>
          </div>
        </div>
      )}
      {docData && isLoading ?
        <div style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }} >
          <ShimmerThumbnail className="mr-48 m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" />
        </div> :
        getDrName &&
        <div id='capture' style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
          <div id="section1" className='mt-12'>
            <div className="maniContainer p-3 m-3">
              <div className='details'>
                <div className="basi-details">
                  <div className="head p-2">
                    <span>Dr Name: </span><br />
                    <span>Dr Mobile: </span>
                  </div>

                  {
                    docData && docData.finalDetails && docData.finalDetails[0].name &&
                    <div className="content p-2">
                      {
                        docData && docData.finalDetails && docData.finalDetails[0] &&
                        <>
                          <span>{docData.finalDetails[0].name && docData.finalDetails[0].name}</span><br />
                          <span>{docData.finalDetails[0].phone && docData.finalDetails[0].phone}</span><br />
                        </>
                      }
                      {/* <span>abc</span> */}
                    </div>
                  }
                </div>
                <div className='p-2 download'>
                  <button className='download-btn'
                    onClick={() => {
                      setIsPopupOpen(true)

                    }}
                  >Download Report</button>
                </div>
                {/* <div className='p-2 download'>
              <button onClick={downloadPDF} className='download-btn'>Download Report</button>
            </div> */}
              </div>
              {
                rows.length !== 0 && (
                  <TableComponent bcolor="white" title="Monthly Improvement Report" head={head} rows={rows}></TableComponent>
                )
              }
            </div>
            <div className="keywords_compititors">
              <div className="maniContainer p-3 m-3" style={{ width: "50%" }}>

                <h3 className="font-medium  text-[#07509D] px-3 py-2">Comparision with other clinicians</h3>
                {
                  cRows.length !== 0 && (
                    <TableComponent bcolor="white" title="Competitors" head={cHead} rows={cRows}></TableComponent>
                  )
                }
              </div>
              <div className="maniContainer p-3 m-3" style={{ width: "50%" }}>
                {/* <h5>Path to #1 on Google searches</h5> */}
                <h3 className="font-medium  text-[#07509D] px-3 py-2">Path to #1 on Google searches</h3>
                {
                  lRows.length !== 0 && (
                    <TableComponent bcolor="white" title="Keywords Ranking" head={lHead} rows={lRows}></TableComponent>
                  )
                }
              </div>
            </div>
          </div>
          <div id="section2">
            {images != '' &&
              <>
                <div className="maniContainer p-3 m-3">
                  {/* <h5>See how your GMB profile looks...</h5> */}
                  <h3 className="font-medium  text-[#07509D] px-3 py-2">See how your GMB profile looks...</h3>
                  <center>
                    <img src={images[0].profile} alt="" />
                  </center>
                </div>

                <div className="maniContainer p-3 m-3">
                  {/* <h5>Actual search results on google</h5> */}
                  <h3 className="font-medium  text-[#07509D] px-3 py-4">Actual search results on google</h3>

                  <center>
                    <img src={images[0].lable1} width="90%" />
                    <hr />
                    <img src={images[0].lable2} width="90%" />
                  </center>
                </div>
              </>
            }
          </div>


          <div id="section3">
            <div style={{ pageBreakBefore: 'always' }}></div>

            <div className="maniContainer p-3 m-3">
              {/* <h5>Analytics</h5> */}
              <h3 className="font-medium  text-[#07509D] px-3 py-2">Analytics</h3>

              {
                docData && (
                  <>
                    <div className='row'>
                      <div className="col-md-4" >
                        <GraphicalContainer gtype={"ColumnChart"} averageBlock={true} title={'Searches (Mobile + Desktop)'} callsGraphData={reorderGraphData(docData.searchesGraph[0])} bcolor='white' width={"100%"}></GraphicalContainer>
                      </div>
                      <div className="col-4">

                        <GraphicalContainer gtype={"ColumnChart"} averageBlock={true} title={'Maps (Mobile + Desktop)'} callsGraphData={reorderGraphData(docData.mapsGraph[0])} bcolor='white' width={"100%"}></GraphicalContainer>
                      </div>
                      <div className="col-4">

                        <GraphicalContainer averageBlock={true} gtype={"ColumnChart"} title={'(Web + Directions + Phone)'} callsGraphData={reorderGraphData(docData.actionGraph[0])} bcolor='white' width={"100%"}></GraphicalContainer>
                      </div>
                    </div>
                  </>
                )
              }
            </div>




            <div className="maniContainer p-3 m-3">
              <h3 className="font-medium  text-[#07509D] px-3 py-2">Review & Rating</h3>

              {/* <h5>Review & Rating</h5> */}
              {
                docData && (
                  <>
                    <div className="row">
                      <div className="col-6">
                        {
                          topreview_body.length != 0 && topreview_body ? (
                            <TableComponent bcolor="white" title="Current month top FIVE positive reviews" head={Topreview_head} rows={topreview_body}></TableComponent>
                          ) : (
                            <>
                              <div className="review_rating m-2 ">
                                <span className='table-heading graphs'>Current 5 Positive Reviews</span>
                                <center>No Data Found</center>
                              </div>
                            </>
                          )
                        }
                      </div>
                      <div className="col-6">
                        {
                          lestreview_body.length != 0 && lestreview_body ? (
                            <TableComponent bcolor="white" title="Current 5 Negitive Reviews" head={Topreview_head} rows={lestreview_body}></TableComponent>) : <>
                            <div className="review_rating m-2 ">
                              <span className='table-heading graphs'>Current 5 Negitive Reviews</span>
                              <center>No Data Found</center>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                    <div className='row'>

                      <div className="col-6">
                        <div className="m-2">
                          <GraphicalContainer gtype={"PieChart"} averageBlock={false} title={'Total Number of Ratings'} callsGraphData={rr} bcolor='white' width={"100%"}></GraphicalContainer>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="review_rating m-2 ">
                          <div class="graphs">Total Rating</div>
                          {docData.basicDetails && docData.finalDetails?.length > 0 &&
                            (() => {
                              const details = docData.finalDetails[0];
                              const avgRating = details.averageRating ? details.averageRating.toFixed(1) : "0.0";
                              const totalReviews = details.totalReviewCount ?? 0;

                              return (
                                <>
                                  <span>{avgRating}</span><br />
                                  <span>{ratingsuggestion}</span>
                                  <h6 className='mt-3'>Total Reviews</h6>
                                  <span>{totalReviews}</span><br />
                                  <span>
                                    <a
                                      href={`https://www.google.com/search?q=${details.name?.replace(/ /g, '+')}+reviews+rating`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Click Here
                                    </a> to see a complete log of Reviews and Rating
                                  </span>
                                </>
                              );
                            })()
                          }

                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>

      }
      {/* Popup */}
      {isPopupOpen && (
        <Popup
          downloadPDF={downloadPDF}
          exportToExcel={exportToExcel}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  ) : (
    <div
      style={{
        marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
        transition: "margin-left 0.5s ease",
      }}
      className="p-6"
    >
      {doctorAnalysis && doctorAnalysis.length > 0 ? (
        <>
          <h3 className="font-normal text-[0.9rem] text-gray-700 mb-4">
            Profile Analysis
          </h3>
          <table className="w-full rounded-xl overflow-hidden border border-gray-200">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2 rounded-tl-xl">S.No</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2 ">Profile</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">GS - Mobile</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">GS - Desktop</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">GM - Mobile</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">GM - Desktop</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">Calls</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">Directions</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2">Website Clicks</th>
                <th className="font-normal text-[0.9rem] text-gray-700 p-2 rounded-tr-xl">Overall Searches</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctorRows.map((row, index) => (
                <tr
                  key={index}
                  className="text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    // show immediate overlay while request starts
                    setShowErrorOverlay(false);
                    setErrorMessage("");
                    setShowPreloader(true);
                    setIsLoading(true);
                    setDrName(row._id);
                  }}
                >
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row._id}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Google Search Mobile"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Google Search Desktop"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Google Maps Mobile"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Google Maps Desktop"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Calls"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Directions"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["Website Clicks"]}</td>
                  <td className="font-normal text-[0.9rem] text-gray-700 p-2">{row["overallSearches"]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 gap-2 text-gray-700">
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <h6 className="text-center mt-5">Profile Unavailable</h6>
      )}
    </div>
  );


}



const Popup = ({ exportToExcel, downloadPDF, onClose }) => (
  <div
    className="modal fade show d-flex justify-content-center align-items-center"
    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    tabIndex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
  >  <div className="modal-dialog modal-dialog-centered">
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

// I am a marketing company,managing and marketing multiple google my business profiles of the doctors in multiple mails around (1600 profiles in 30 mails) now client want a dashboard In which they can see all the profiles performance in one dashboard rather than logging into each mail and checking individual profile performance is it possible to create such dashboard where i can see all profiles performance in one dashboard.
// Data should be fetched from google my business api or any other way possible. Please suggest.
// In Dashboard we should be able to see following details of all profiles:
// Verified / unverified profiles, Suspended profiles, Profile views, Search views, Map views, Calls received, Direction requests, Website clicks, Photos views and photo quantity, Reviews count and ratings etc.
// Top Performing profiles, Low performing profiles based on views and actions etc.
