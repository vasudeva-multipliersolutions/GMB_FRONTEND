import React, { useEffect, useState, useContext, useRef } from 'react'
import '../stylesheets/docreport.css'
import TableComponent from '../components/TableComponent'
import GraphicalContainer from './GraphicalContainer'
import { SharedContext } from '../context/SharedContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ShimmerThumbnail } from "react-shimmer-effects";
import { ShimmerTitle } from "react-shimmer-effects";
import { SidebarContext } from '../SidebarContext'

export default function BasicDetailsComponent() {
  const [docData, setDocData] = useState()
  const { getDrName } = useContext(SharedContext)
  const [isLoading, setIsLoading] = useState(true)
  var ratingsuggestion = ""
  const api = localStorage.getItem('API')

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);

  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        const response = await fetch(`${api}/docData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "businessName": getDrName })
        });
        const data = await response.json();
        console.log("datyaK: ", data);
        setDocData(data);
      }
      getDocData();
      setIsLoading(false);
    }
  }, [getDrName])
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
    console.log(docData)
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
      console.log(docData.goodreviews[0])
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
    const input = document.querySelector('#capture');


    const scale = 2;

    html2canvas(input, { scale: scale }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');


      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('docreport.pdf');
    });
  };



  return (
    <>
      {isLoading ?
        <div>
          <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" />
        </div> :
        getDrName &&
        <div id='capture' style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
          <div className="maniContainer p-3 m-3">
            <div className='details'>
              <div className="basi-details">
                <div className="head p-2">
                  <span>Dr Name: </span><br />
                  <span>Dr Mobile: </span>
                </div>
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

              </div>
              <div className='p-2 download'>
                <button className='download-btn' onClick={downloadPDF}>Download Report</button>
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
                  <TableComponent bcolor="white" title="Competitores" head={cHead} rows={cRows}></TableComponent>
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


          <div style={{ pageBreakBefore: 'always' }}></div>

          <div className="maniContainer p-3 m-3">
            <h5>Analytics</h5>
            {
              docData && (
                <>
                  <div className='row'>
                    <div className="col-md-4" >
                      <GraphicalContainer gtype={"PieChart"} title={'Searches (Mobile + Desktop)'} callsGraphData={docData.searchesGraph[0]} bcolor='white' width={"100%"}></GraphicalContainer>
                    </div>
                    <div className="col-4">

                      <GraphicalContainer gtype={"PieChart"} title={'Maps (Mobile + Desktop)'} callsGraphData={docData.mapsGraph[0]} bcolor='white' width={"100%"}></GraphicalContainer>
                    </div>
                    <div className="col-4">

                      <GraphicalContainer gtype={"PieChart"} title={'Action (Web + Directions + Phone)'} callsGraphData={docData.actionGraph[0]} bcolor='white' width={"100%"}></GraphicalContainer>
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
                        <GraphicalContainer gtype={"PieChart"} title={'Total Number of Ratings'} callsGraphData={rr} bcolor='white' width={"100%"}></GraphicalContainer>
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
                            <span><a href="https://search.google.com/local/writereview?placeid=ChIJWyQ_LWJfrTsR6MJbrV4JF_s">Click Here</a> to Know a compleate log of Reviews and Rating</span>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </div>

      }
    </>
  )
}
