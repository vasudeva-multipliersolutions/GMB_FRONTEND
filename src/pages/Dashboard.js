import React, { useContext, useEffect, useState } from "react";
import "../stylesheets/dashboard.css";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import Navbar from "../components/Navbar";
import ContentContainer from "../components/ContentContainer";
import ReviewRating from "../components/ReviewRating";
import GraphicalContainer from "../components/GraphicalContainer";
import { SharedContext } from "../context/SharedContext";
import { useNavigate } from "react-router-dom";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { SidebarContext } from "../SidebarContext";
import SideContentContainer from "../components/SideContentContainer";
import TopDoctor from "./TopDoctor";
import html2canvas from 'html2canvas'
import { BsFiletypePdf } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import jsPDF from 'jspdf'
import * as XLSX from "xlsx";



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



export default function Dashboard(props) {
  const navigate = useNavigate();
  const [showAllData, setAllData] = useState(null);
  const [analysisData, setAnalysisData] = useState();
  const [contextCity, setContextCity] = useState();
  const [contextMonth, setContextMonth] = useState();
  const [contextYear, setContextYear] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [use, setUse] = useState([]);
  const { isCollapsed } = useContext(SidebarContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [getInsightState, setInsightsState] = useState();
  const [getInsightsCity, setInsightsCity] = useState();
  const [contextHospitals, setcontextHospitals] = useState();
  const [InsightsAnalysis, setInsightsAnalysis] = useState();
  const [reload, setReloadCondition] = useState();
  const [currentCluster, setCurrentCluster] = useState("");
  const [topDoctorData, setTopDoctorData] = useState([]);
  const [contextSpeciality, setContextSpeciality] = useState();



  const mail = localStorage.getItem("mail");
  const loginEmail = localStorage.getItem("loginEmail");
  const username1 = localStorage.getItem("username");
  const psw1 = localStorage.getItem("psw");
  const api = localStorage.getItem("API");
  const Branch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");
  const token = localStorage.getItem("token");

  console.log("COntext Month  :" + contextMonth);


  useEffect(() => {
    const clusterEmails = [
      "southcluster@gmail.com",
      "delhincrcluster@gmail.com",
      "northwestcluster@gmail.com",
      "goamanglorecluster@gmail.com",
      "southeastcluster@gmail.com",
      "internationalcluster@gmail.com",
      "vcdoctorcluster@gmail.com",
      "eastcluster@gmail.com",
    ];

    if (clusterEmails.includes(mail)) {
      setCurrentCluster(Cluster);
    } else {
      setCurrentCluster("");
    }
  }, [navigate, username1, psw1, api, mail]);


  useEffect(() => {
    setAllData(InsightsAnalysis);
  }, [InsightsAnalysis]);

  //console.log( "+++++++++++++++++ data:" + reload);
  async function getAllData(branch) {
    try {
      const response = await fetch(`${api}/${branch}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        localStorage.clear();
        window.location.reload();
      }

      const data = await response.json();
      // console.log("1234🎉✨🎉🎉 : " + response.status);



      setAllData(data);

      //console.log( "+++++++++++++++++ data:" + data.reviewRating[0].averagerating);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  //console.log("SetContextYear : " + contextYear);
  async function getMonthData(month) {
    try {
      const cityToSend = contextCity === "All" ? "" : contextCity;
      const monthToSend = month === "All" ? "" : month;
      const stateToSend = getInsightState;

      //console.log("000000-----00000000000) : " + stateToSend);
      const response = await fetch(`${api}/monthdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          month: monthToSend,
          branch: cityToSend,
          state: stateToSend,
          speciality: contextSpeciality,
        }),
      });
      if (response.status === 403 || response.status === 404) {
        localStorage.clear();
        window.location.reload();
      }
      const data = await response.json();
      setAllData("");
      setAllData(data);
      //console.log("+++++++++++++++++ data:" + data.reviewRating[0].averagerating);
      //console.log("333333333333 data:" + data.analysis[0]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  async function getClusterData(cluster) {
    try {

      const response = await fetch(`${api}/monthdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          state: cluster,
        }),
      });
      const data = await response.json();
      setAllData("");
      setAllData(data);
      //console.log("+++++++++++++++++ data:" + data.reviewRating[0].averagerating);
      //console.log("333333333333 data:" + data.analysis[0]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (event.key === "username" && event.newValue === null) {
  //       navigate("/");
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   const username = localStorage.getItem("username");
  //   if (!username) {
  //     navigate("/");
  //     return;
  //   }

  //   async function getAnalysisData() {
  //     try {
  //       const response = await fetch("http://localhost:2024/api/login", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ username: username1, psw: psw1 }),
  //       });
  //       const result = await response.json();
  //       setAnalysisData(result);
  //     } catch (error) {
  //       console.error("Error fetching analysis data:", error);
  //     }
  //   }

  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   if (mail == "manipal@gmail.com") {
  //     getAllData("No");
  //   } else if (currentCluster == ""){
  //     if (Branch && currentCluster === ""){
  //     getAllData(Branch);
  //     } else {
  //       setInsightsState(Cluster);
  //       if (currentCluster !== "") {
  //         setInsightsCity("");
  //         getClusterData(Cluster);
  //       }
  //     }
  //   } 

  //   getAnalysisData();


  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [navigate, username1, psw1, api, mail, currentCluster]);


  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "username" && event.newValue === null) {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/");
      return;
    }

    async function getAnalysisData() {
      try {
        const response = await fetch("http://localhost:2024/api/logindata", {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({ username: loginEmail, psw: psw1 }),
        });
        const result = await response.json();
        setAnalysisData(result);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (mail === "manipal@gmail.com") {
      getAllData("No");
    } else {
      if (Branch && Branch !== "undefined") {
        //console.log("Branch@@@@@@@@ : " + Branch);
        getAllData(Branch);
      } else if (Cluster) {
        setInsightsState(Cluster);
        getClusterData(Cluster);
      }
    }

    getAnalysisData();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, username1, psw1, api, mail, currentCluster, Branch, Cluster]);



  useEffect(() => {
    if (locationProfiles && locationProfiles[0]) {
      const verificationData = [
        {
          "Total Profiles":
            locationProfiles[0]["Total Profiles"]
          //-locationProfiles[0]["Need Access"],
        },
        { "Verified Profiles": locationProfiles[0]["Verified Profiles"] },
        { "Unverified Profiles": locationProfiles[0]["Unverfied Profiles"] },
        { "Not Intrested": locationProfiles[0]["Not Intrested"] },
        { "Out of Organization": locationProfiles[0]["Out Of Organization"] },
      ];
      setUse(verificationData);
    } else if (analysisData && analysisData[0]) {
      const verificationData = [
        { "Total Profiles": analysisData[0]["Total Profiles"] },
        { "Verified Profiles": analysisData[0]["Total Verified"] },
        { "Unverified Profiles": analysisData[0]["Unverified"] },
        { "Not Intrested": analysisData[0]["Not Intrested"] },
        { "Out of Organization": analysisData[0]["Organization"] },
      ];
      setUse(verificationData);
    }
  }, [analysisData, locationProfiles]);

  // use.map((item) => {
  //   Object.entries(item).map(([key, value]) => {
  //     if (key !== "_id") {
  //       console.log("getContextKey@@@@@@@@ : "+key);
  //       console.log("getContextValue@@@@@@@@ : "+value);
  //     }
  //   })
  // })

  useEffect(() => {
    // console.log("getContextCity@@@@@@@@ : " + contextCity);
    if (contextCity) {
      getMonthData("");
    }
  }, [contextCity]);

  useEffect(() => {
    //console.log("getInsightState@@@@@@@@ : " + getInsightState);
    if (getInsightState) {
      getMonthData("");
    }
  }, [getInsightState]);

  useEffect(() => {
    if (contextMonth) {
      getMonthData(contextMonth);
    }
  }, [contextMonth]);

  useEffect(() => {
    if (contextSpeciality) {
      getMonthData(contextMonth);
    }
  }, [contextSpeciality]);

  useEffect(() => {
    if (currentCluster) {
      getClusterData(currentCluster);
    }
  }, [currentCluster]);


  const username = analysisData?.[0]?.user;
  const logo = username === "Manipal" ? manipalLogo : careLogo;

  // console.log("1234getInsightState : " + getInsightState + "and my123getInsighCity : " + getInsightsCity);
  //console.log("^^^^^^^^^^^^^^^^^------------>"+ showAllData.graphDataCalls[0])
  const monthsCalls = showAllData?.graphDataCalls?.[0]
    ? Object.keys(showAllData.graphDataCalls[0])
    : [];
  // console.log("Months for Calls:", monthsCalls);
  //console.log("Location Profiles--0-- : ", locationProfiles)



  //console.log("Location Profiles--0-- : ", currentCluster);
  useEffect(() => {
    //getMonthData("");
  }, [reload]);

  const downloadPDF = async () => {
    const content = document.getElementById('mainDashboardContent');
    const cloneContainer = document.getElementById('pdf-clone-container');

    if (!content || !cloneContainer) {
      console.error("Missing elements for PDF generation.");
      return;
    }

    // Clone the content
    const clone = content.cloneNode(true);
    clone.style.marginLeft = '0';
    clone.style.width = '100%';

    const elementsWithStyles = clone.querySelectorAll('[style]');
    elementsWithStyles.forEach(el => {
      el.style.marginLeft = '0';
      el.style.width = '100%';
    });

    cloneContainer.innerHTML = '';
    cloneContainer.appendChild(clone);
    cloneContainer.style.display = 'block';

    const scale = 2;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Padding values
    const topPadding = 10;     // mm
    const leftPadding = 10;    // mm
    const rightPadding = 0;   // mm

    try {
      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;

      // Available space inside the PDF considering paddings
      const availableWidth = pdfWidth - leftPadding - rightPadding;
      const availableHeight = pdfHeight - topPadding;

      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      let remainingHeight = scaledHeight;
      let pageIndex = 0;

      while (remainingHeight > 0) {
        if (pageIndex > 0) pdf.addPage();

        const offsetY = pageIndex * pdfHeight;
        const imgY = topPadding;
        const imgX = leftPadding;

        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY,
          scaledWidth,
          scaledHeight,
          undefined,
          'FAST'
        );

        remainingHeight -= pdfHeight;
        pageIndex++;
      }

      const parts = [
        getInsightState || "",
        getInsightsCity || "",
        contextMonth || "",
        contextSpeciality || "",
        // Optional: add speciality if available e.g., `speciality || ""`
      ].filter(Boolean); // removes empty strings

      const filename = parts.length > 0 ? `GMB_Performance_Report_${parts.join("_")}.xlsx` : "GMB Performance Report.xlsx";

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      cloneContainer.style.display = 'none';
    }
  };


  // const downloadDataAsExcel = () => {
  //   const workbook = XLSX.utils.book_new();

  //   // Sheet 1: ContentContainer
  //   if (use && use.length > 0) {
  //     const useSheet = XLSX.utils.json_to_sheet(use.map(obj => {
  //       const key = Object.keys(obj)[0];
  //       return { Profiles: key, Counts: obj[key] };
  //     }));
  //     XLSX.utils.book_append_sheet(workbook, useSheet, "Profile Counts");
  //   }

  //   // Sheet 2: ReviewRating
  //   if (showAllData?.reviewRating?.length > 0) {
  //     const reviewSheet = XLSX.utils.json_to_sheet(showAllData.reviewRating);
  //     XLSX.utils.book_append_sheet(workbook, reviewSheet, "ReviewRating");
  //   }

  //   // Sheet 3: Analysis
  //   if (showAllData?.analysis?.length > 0) {
  //     const analysisSheet = XLSX.utils.json_to_sheet(showAllData.analysis);
  //     XLSX.utils.book_append_sheet(workbook, analysisSheet, "Analysis");
  //   }

  //   //Sheet 4: Top Doctor Data
  //   if (Array.isArray(topDoctorData) && topDoctorData.length > 0) {
  //     const header = [
  //       "Name / Hospital",
  //       "GS - Mobile",
  //       "GS - Desktop",
  //       "GM - Mobile",
  //       "GM - Desktop",
  //       "Website Clicks",
  //       "Directions Clicks",
  //       "Phone Calls"
  //     ];

  //     // Process each row to ensure it's an array of cells
  //     const dataRows = topDoctorData.map(row => {
  //       if (Array.isArray(row)) {
  //         return row; // Already an array, use as-is
  //       } else if (typeof row === 'string') {
  //         // Split string by commas to create row array
  //         return row.split(',');
  //       } else {
  //         console.warn('Unexpected data format in row:', row);
  //         return []; // Fallback to empty array to avoid errors
  //       }
  //     });

  //     // Combine header with processed data rows
  //     const doctorRows = [header, ...dataRows];
  //     const doctorSheet = XLSX.utils.aoa_to_sheet(doctorRows);
  //     XLSX.utils.book_append_sheet(workbook, doctorSheet, "TopDoctors");
  //   }


  //   // Build filename dynamically
  //   const parts = [
  //     getInsightState || "",
  //     getInsightsCity || "",
  //     contextMonth || "",
  //     contextSpeciality || "",
  //     // Optional: add speciality if available e.g., `speciality || ""`
  //   ].filter(Boolean); // removes empty strings

  //   const filename = parts.length > 0 ? `GMB_Performance_Report_${parts.join("_")}.xlsx` : "GMB Performance Report.xlsx";

  //   // Export Excel file
  //   XLSX.writeFile(workbook, filename);
  // };

  //console.log("getContextCity@@@@@@@@******^^^^^^^^^^^^^^^%%%%%%%%%%%%%$$$$$$$$$$#### : " + topDoctorData);




  const downloadDataAsExcel = () => {
    const workbook = XLSX.utils.book_new();

    const autoFitColumns = (data) => {
      const colWidths = data[0].map((_, colIndex) => {
        const maxLen = data.reduce((max, row) => {
          const cell = row[colIndex] ?? "";
          return Math.max(max, String(cell).length);
        }, 10);
        return { wch: maxLen + 2 };
      });
      return colWidths;
    };

    // Helper to create sheet with bold headers and auto width
    const createStyledSheet = (data, sheetName) => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Bold header
      const headerRow = data[0];
      headerRow.forEach((_, i) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
        if (!worksheet[cellAddress]) return;
        worksheet[cellAddress].s = {
          font: { bold: true }
        };
      });

      worksheet["!cols"] = autoFitColumns(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    // Sheet 1: Profile Counts
    if (use && use.length > 0) {
      const rows = [["Profiles", "Counts"]];
      rows.push(...use.map(obj => {
        const key = Object.keys(obj)[0];
        return [key, obj[key]];
      }));
      createStyledSheet(rows, "Profile Counts");
    }

    // Sheet 2: Review Rating (exclude _id and round averageRating)
    if (Array.isArray(showAllData?.reviewRating) && showAllData.reviewRating.length > 0) {
      const cleaned = showAllData.reviewRating.map(({ _id, ...rest }) => {
        if (typeof rest.averageRating === 'number') {
          rest.averageRating = Math.round(rest.averageRating * 10) / 10; // Round to 1 decimal place
        }
        return rest;
      });

      const headers = Object.keys(cleaned[0]);
      const rows = [headers, ...cleaned.map(obj => headers.map(h => obj[h]))];
      createStyledSheet(rows, "Review Rating");
    }


    // Sheet 3: Analysis (exclude _id)
    if (Array.isArray(showAllData?.analysis) && showAllData.analysis.length > 0) {
      const cleaned = showAllData.analysis.map(({ _id, ...rest }) => rest);
      const headers = Object.keys(cleaned[0]);
      const rows = [headers, ...cleaned.map(obj => headers.map(h => obj[h]))];
      createStyledSheet(rows, "Analysis Data");
    }

    // Sheet 4: TopDoctors
    if (Array.isArray(topDoctorData) && topDoctorData.length > 0) {
      const header = [
        "Name / Hospital",
        "GS - Mobile",
        "GS - Desktop",
        "GM - Mobile",
        "GM - Desktop",
        "Website Clicks",
        "Directions Clicks",
        "Phone Calls"
      ];
      const rows = topDoctorData.map(row => {
        if (Array.isArray(row)) return row;
        if (typeof row === 'string') return row.split(',');
        console.warn("Unexpected format in topDoctorData row:", row);
        return [];
      });
      createStyledSheet([header, ...rows], "Top 100 Doctor's Data");
    }

    // Build dynamic filename
    const parts = [
      getInsightState || "",
      getInsightsCity || "",
      contextMonth || "",
      contextSpeciality || ""
    ].filter(Boolean);

    const filename = parts.length > 0
      ? `GMB_Performance_Report_${parts.join("_")}.xlsx`
      : "GMB_Performance_Report.xlsx";

    // Write file
    XLSX.writeFile(workbook, filename);
  };






























  return (
    <SharedContext.Provider
      value={{
        contextCity,
        setContextCity,
        locationProfiles,
        setLocationProfiles,
        setContextMonth,
        contextMonth,
        setContextYear,
        getInsightState,
        setInsightsState,
        getInsightsCity,
        setInsightsCity,
        setcontextHospitals,
        setInsightsAnalysis,
        setReloadCondition,
        currentCluster,
        setTopDoctorData,
        contextSpeciality,
        setContextSpeciality,
        contextSpeciality,
      }}
    >
      <div style={{ background: "#EFEFEF" }}>
        <Navbar
          logoimg={logo ? logo : ""}
          username={username}
          serach={mail === "manipal@gmail.com" ? true : false}
          monthhide={mail === "manipal@gmail.com" || currentCluster !== "" ? true : false}
          topdoc={true}
          monthfilter={true}
          monthsCalls={monthsCalls}
          contextHospitals={contextHospitals}
          currentCluster={currentCluster}
        />
        <div className="text-end me-5 mt-4">
          <button className="btn btn-outline-primary me-1 " onClick={downloadPDF}><BsFiletypePdf /></button>
          <button className="btn btn-outline-success" onClick={downloadDataAsExcel}>
            <RiFileExcel2Fill />
          </button>

        </div>


        {/* Root-level check for showAllData */}
        <div id="mainDashboardContent">
          {showAllData && showAllData.length !== 0 ? (
            <>
              {use && <ContentContainer data={use} />}
              <div
                className="second-container"
                style={{
                  marginLeft:
                    windowWidth > 768 ? (isCollapsed ? "8%" : "20%") : "20%",
                  transition: "margin-left 0.5s ease",
                }}
              >
                <div className="left-container m-2">
                  {showAllData?.reviewRating?.length > 0 ? (
                    <ReviewRating
                      review={
                        showAllData.reviewRating[0]?.totalreviews ?? "No reviews"
                      }
                      rating={
                        showAllData.reviewRating[0]?.averagerating ??
                        "No rating available"
                      }
                    />
                  ) : (
                    <ReviewRating
                      review={0}
                      rating={0}
                    />
                    // <div>No reviews or ratings available</div>
                  )}
                </div>

                {showAllData?.analysis?.length > 0 ? (
                  <SideContentContainer data={showAllData.analysis} />
                ) : (
                  <h6 className="d-flex justify-content-center align-items-center">No analysis data available</h6>
                )}
              </div>

              <TopDoctor contextHospitals={contextHospitals} contextMonth={contextMonth} />

              <div
                className="grapharea"
                style={{
                  marginLeft:
                    windowWidth > 768 ? (isCollapsed ? "8%" : "20%") : "20%",
                  width:
                    windowWidth > 768 ? (isCollapsed ? "91.5%" : "80%") : "80%",
                  transition: "margin-left 0.5s ease",
                }}
              >
                <div className="right-container me-5">
                  {isLoading ? (
                    <ShimmerThumbnail height={420} width={2000} rounded />
                  ) : (
                    <>
                      {showAllData?.graphDataCalls?.length > 0 && (
                        <GraphicalContainer
                          gtype={"ColumnChart"}
                          averageBlock={true}
                          title={"Calls"}
                          callsGraphData={reorderGraphData(showAllData.graphDataCalls[0], true)}
                          bcolor={"#FFFFFF"}
                          width={"50%"}
                        />
                      )}
                      {showAllData?.graphDataSearches?.length > 0 && (
                        <GraphicalContainer
                          gtype={"ColumnChart"}
                          averageBlock={true}
                          title={"Desktop Searches"}
                          callsGraphData={reorderGraphData(showAllData.graphDataSearches[0])}
                          bcolor={"#FFFFFF"}
                          width={"50%"}
                        />
                      )}
                    </>
                  )}
                </div>

                <div className="right-container">
                  {isLoading ? (
                    <ShimmerThumbnail height={420} width={2000} rounded />
                  ) : (
                    <>
                      {showAllData?.graphDataSearchesMobils?.length > 0 && (
                        <GraphicalContainer
                          gtype={"ColumnChart"}
                          averageBlock={true}
                          title={"Mobile Searches"}
                          callsGraphData={reorderGraphData(showAllData.graphDataSearchesMobils[0])}
                          bcolor={"#FFFFFF"}
                          width={"50%"}
                        />
                      )}
                      {showAllData?.graphDataWebsiteClicks?.length > 0 && (
                        <GraphicalContainer
                          gtype={"ColumnChart"}
                          averageBlock={true}
                          title={"Website Clicks"}
                          callsGraphData={reorderGraphData(showAllData.graphDataWebsiteClicks[0])}
                          bcolor={"#FFFFFF"}
                          width={"50%"}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div class="d-flex justify-content-center align-items-center">Loading...</div> // Message if showAllData is empty or missing
          )}
        </div>
      </div>
      <div id="pdf-clone-container" style={{ display: 'none' }}></div>

    </SharedContext.Provider>
  );
}