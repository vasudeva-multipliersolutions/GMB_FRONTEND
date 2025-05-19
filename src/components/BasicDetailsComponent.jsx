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
  const { getDrName } = useContext(SharedContext)
  const [isLoading, setIsLoading] = useState(true)
  var ratingsuggestion = ""
  const api = localStorage.getItem('API')
  const token = localStorage.getItem("token");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        try {
          const response = await fetch(`${api}/docData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ "businessName": getDrName })
          });

          if (response.status === 403 || response.status === 404) {
            localStorage.clear();
            window.location.reload();
          }
        

          if (!response.ok) {
            // If response status is not OK, set docData to null
            setDocData(null);
            setIsLoading(false);
            return;
          }

          const data = await response.json();
          if (!data || Object.keys(data).length === 0 || data.cRank.length === 0) {
            // If data is empty or invalid, set docData to null
            setDocData(null);
          } else {
            setDocData(data);
          }
        } catch (error) {
          console.error("Error fetching docData:", error);
          setDocData(null);
        } finally {
          setIsLoading(false);
        }
      }

      getDocData();
    }
  }, [getDrName]);

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
  setTimeout(() => {
    setIsLoading(false)
  }, 2000);



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



  return docData !== null ? (
    <>
      {docData && isLoading ?
        <div>
          <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" />
        </div> :
        getDrName &&
        <div id='capture' style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
          <div id="section1">
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
                <h5>Comparision with other clinicians</h5>
                {
                  cRows.length !== 0 && (
                    <TableComponent bcolor="white" title="Competitors" head={cHead} rows={cRows}></TableComponent>
                  )
                }
              </div>
              <div className="maniContainer p-3 m-3" style={{ width: "50%" }}>
                <h5>Path to #1 on Google searches</h5>
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
                  <h5>See how your GMB profile looks...</h5>
                  <center>
                    <img src={images[0].profile} alt="" />
                  </center>
                </div>

                <div className="maniContainer p-3 m-3">
                  <h5>Actual search results on google</h5>
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
              <h5>Analytics</h5>
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
              <h5>Review & Rating</h5>
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
                          {docData.basicDetails &&
                            <>
                              <span>{docData.basicDetails[0].averageRating.toFixed(1)}</span><br />
                              <span>{ratingsuggestion}</span>
                              <h6 className='mt-3'>Total Reviews</h6>
                              <span>{docData.basicDetails[0].totalReviewCount}</span><br />
                              <span>
                                <a
                                  href={`https://www.google.com/search?q=${docData.finalDetails[0].name.replace(/ /g, '+')}+reviews+rating`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click Here
                                </a> to see a complete log of Reviews and Rating
                              </span>                          </>
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
    <div class="d-flex vh-100 justify-content-center mt-3">
      <h6>Data Unavailable....</h6>
    </div>
  )
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