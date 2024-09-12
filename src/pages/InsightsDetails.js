import React, { useEffect, useState, useContext, useRef } from "react";
import "../stylesheets/docreport.css";
import TableComponent from "../components/TableComponent";

import { SharedContext } from "../context/SharedContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { ShimmerTitle } from "react-shimmer-effects";

export default function BasicDetailsComponent() {
  const [docData, setDocData] = useState();
  const { getDrName, getInsightState, getInsightCity } =useContext(SharedContext);
  const { insitecontext } = useContext(SharedContext);
  const [isLoading, setIsLoading] = useState();
  const [getCity, setCity] = useState();
  const [getState, setState] = useState();
  const [insightdata, setinsightdata] = useState();

  var ratingsuggestion = "";
  const api = localStorage.getItem("API");

  useEffect(() => {

    setState(getInsightState);
    setCity(getInsightCity);
    if (getDrName) {


      async function getDocData() {
        const response = await fetch(`${api}/docData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ businessName: getDrName }),
        });
        const data = await response.json();
        console.log("datyaK: ", data);
        setDocData(data);
      }
      getDocData();
      setIsLoading(true);
    } else if (getInsightState || getInsightCity) {
      async function datafilter() {
        const response = await fetch("" + api + "/datafilter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: getState, branch: getCity }),
        });
        const data2 = await response.json();
        // alert("Hello")
        console.log("Insite details filterby harsh: ", data2);
        setinsightdata(data2);
      }
      datafilter();
    }
  }, [getDrName]);

  console.log("%%%%%%%%%%%%%%%%%MyCity "+ getInsightCity + " State : " + getInsightState)

  console.log("GETINSIGHT STATE : " + getInsightState + "  CITY : " + getInsightCity);
  const head = [
    "Month",
    "GS - Mobile",
    "GS - Desktop",
    "GM - Mobile",
    "GM - Desktop",
    "Website Cliks",
    "Directions Clicks",
    "Phone Calls",
  ];
  console.log("787878787............" + docData);
  const rows = [];
  if (docData) {
    console.log("787878787" + docData.result);
    rows.push(docData.result);
  } else {
    console.log("9090909 :" + insightdata);
    rows.push(insightdata);
  }

  console.log("ROWS : " + rows);
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  const downloadPDF = () => {
    const input = document.querySelector("#capture");

    const scale = 2;

    html2canvas(input, { scale: scale }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("docreport.pdf");
    });
  };



  return (
    <>
      
      {isLoading ? (
        <div>
          <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" />
        </div>
      ) : (
        (getDrName || getInsightState.length > 0) && (
          <div id="capture">
            <div className="maniContainer p-3 m-3">
              <div className="details">
                <div className="basi-details">
                  <div className="head p-2">
                    <span>Dr Name: </span>
                    <br />
                    <span>Dr Mobile: </span>
                  </div>
                  <div className="content p-2">
                    {docData &&
                      docData.finalDetails &&
                      docData.finalDetails[0] && (
                        <>
                          <span>
                            {docData.finalDetails[0].name &&
                              docData.finalDetails[0].name}
                          </span>
                          <br />
                          <span>
                            {docData.finalDetails[0].phone &&
                              docData.finalDetails[0].phone}
                          </span>
                          <br />
                        </>
                      )}
                    {/* <span>abc</span> */}
                  </div>
                </div>
                <div className="p-2 download">
                  <button className="download-btn" onClick={downloadPDF}>
                    Download Report
                  </button>
                </div>
                {/* <div className='p-2 download'>
              <button onClick={downloadPDF} className='download-btn'>Download Report</button>
            </div> */}
              </div>
              {rows.length !== 0 && (
                <TableComponent
                  bcolor="white"
                  title="Monthly Improvement Report"
                  head={head}
                  rows={rows}
                ></TableComponent>
              )}
            </div>
          </div>
        )
      )}
     
      {isLoading ? (
        <div>
          <ShimmerThumbnail className="m-2 p-2" height={200} rounded />
          <ShimmerTitle line={2} gap={10} variant="primary" />
        </div>
      ) : (
        getDrName && (
          <div id="capture">
            <div className="maniContainer p-3 m-3">
              <div className="details">
                <div className="p-2 download">
                  <button className="download-btn" onClick={downloadPDF}>
                    Download Report
                  </button>
                </div>
                {/* <div className='p-2 download'>
              <button onClick={downloadPDF} className='download-btn'>Download Report</button>
            </div> */}
              </div>
              {rows.length !== 0 && (
                <TableComponent
                  bcolor="white"
                  title="Monthly Improvement Report"
                  head={head}
                  rows={rows}
                ></TableComponent>
              )}
            </div>
          </div>
        )
      )}
      
    </>
  );
}
