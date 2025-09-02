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
import CombinedLineChart from "../components/CombinedLineChart";




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
  // const [contextCity, setContextCity] = useState([]);
  // const [newMonthContext, setNewMonthContext] = useState([]);
  const { contextState, contextCity, newMonthContext, profileType, sidebarRating, specialityContext } = useContext(SidebarContext);

  const [contextYear, setContextYear] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [use, setUse] = useState([]);
  const { isCollapsed } = useContext(SidebarContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [getInsightState, setInsightsState] = useState([]);
  const [getInsightsCity, setInsightsCity] = useState([]);
  const [contextHospitals, setcontextHospitals] = useState();
  const [InsightsAnalysis, setInsightsAnalysis] = useState();
  const [reload, setReloadCondition] = useState();
  const [currentCluster, setCurrentCluster] = useState("");
  const [topDoctorData, setTopDoctorData] = useState([]);
  const [contextSpeciality, setContextSpeciality] = useState();
  const [contextDepartment, setContextDepartment] = useState();
  const [contextRating, setContextRating] = useState();
  const [deptDetails, setDeptDetails] = useState([]);




  const mail = localStorage.getItem("mail");
  const loginEmail = localStorage.getItem("loginEmail");
  const username1 = localStorage.getItem("username");
  const psw1 = localStorage.getItem("psw");
  const api = localStorage.getItem("API");
  const Branch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");
  const token = localStorage.getItem("token");

  // console.log("COntext Month  :" + locationProfiles[0]["Total Profiles"]);

  //  locationProfiles.forEach((item) => {
  //   const key = Object.keys(item)[0];
  //   const value = item[key];
  //   console.log(`H__________________---------${key}: ${value}`);
  // });


 useEffect(() => {
  if (newMonthContext.length > 0) {
    console.log("Selected months:", newMonthContext);

    // Example API call
    fetch(`/api/data?months=${newMonthContext.join(",")}`)
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);
      });
  }
}, [newMonthContext]);



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
  async function getMonthData(months) {
    try {

      let region = contextState ? contextState : getInsightState ;
      let unit  = contextCity ? contextCity : getInsightsCity;
      let dept = profileType ? profileType : "";
      let rating = sidebarRating ? sidebarRating : "";

      const cityToSend = getInsightsCity === "All" ? "" : unit;
      // const monthToSend = month === "All" ? "" : month;
        const monthsToSend = Array.isArray(months) ? months : [months];
      const stateToSend = region;

      //console.log("000000-----00000000000) : " + stateToSend);
      const response = await fetch(`${api}/monthdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dept: dept,
          month: monthsToSend ,
          branch: Branch !== "undefined" ? Branch : cityToSend,
          state: Cluster !== "undefined" ? Cluster : stateToSend,
          speciality: contextSpeciality,
          rating: rating,
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/logindata`, {
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
          "Total Profiles": locationProfiles[0]["Total Profiles"]
        },
        { "Verified Profiles": locationProfiles[0]["Verified Profiles"] },
        { "Unverified Profiles": locationProfiles[0]["Unverfied Profiles"] },
        { "Need Access": locationProfiles[0]["Need Access"] },
        { "Not Intrested": locationProfiles[0]["Not Intrested"] },
        { "Out of Organization": locationProfiles[0]["Out Of Organization"] },
      ];

      const deptDetails = [
        { "Department": locationProfiles[0]["Department"] },
        { "Hospitals": locationProfiles[0]["Hospitals"] },
        { "Doctor": locationProfiles[0]["Doctor"] },
        { "Clinic": locationProfiles[0]["Clinic"] },
        { "MARS": locationProfiles[0]["MARS"] },
      ]
      setDeptDetails(deptDetails);
      //console.log("Verification Data:", verificationData);
      setUse(verificationData);
    } else if (analysisData && analysisData[0]) {
      const verificationData = [
        { "Total Profiles": analysisData[0]["Total Profiles"] },
        { "Verified Profiles": analysisData[0]["Total Verified"] },
        { "Unverified Profiles": analysisData[0]["Unverified"] },
        { "Need Access": analysisData[0]["Need Access"] },
        { "Not Intrested": analysisData[0]["Not Intrested"] },
        { "Out of Organization": analysisData[0]["Organization"] },
      ];

      const deptDetails = [
        { "Department": analysisData[0]["Department"] },
        { "Hospitals": analysisData[0]["Hospitals"] },
        { "Doctor": analysisData[0]["Doctor"] },
        { "Clinic": analysisData[0]["Clinic"] },
        { "MARS": analysisData[0]["MARS"] },
      ]
      setDeptDetails(deptDetails);
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

  // useEffect(() => {
  //   // console.log("getContextCity@@@@@@@@ : " + contextCity);
  //   if ( contextCity) {
  //     getMonthData("");
  //   }
  // }, [contextCity]);

    useEffect(() => {
    // console.log("getContextCity@@@@@@@@ : " + contextCity);
    if ( getInsightsCity) {
      getMonthData("");
    }
  }, [getInsightsCity]);

  useEffect(() => {
    //console.log("getInsightState@@@@@@@@ : " + getInsightState);
    if (getInsightState) {
      getMonthData("");
    }
  }, [getInsightState]);

  useEffect(() => {
    if (newMonthContext) {
      getMonthData(newMonthContext);
    }
  }, [newMonthContext]);

  useEffect(() => {

    getMonthData(newMonthContext);

  }, [contextSpeciality]);

  useEffect(() => {

    getMonthData(newMonthContext);
  }, [contextRating]);

  useEffect(() => {
    if (currentCluster) {
      getClusterData(currentCluster);
    }
  }, [currentCluster]);

  useEffect(() => {

    getMonthData(newMonthContext);

  }, [contextDepartment]);


  
  useEffect(() => {

    getMonthData(newMonthContext);

  }, [contextState]);


  useEffect(() => {

    getMonthData(newMonthContext);

  }, [specialityContext]);

  
  useEffect(() => {

    getMonthData(newMonthContext);

  }, [contextCity]);



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
  if (!content) {
    console.error("Dashboard content not found");
    return;
  }

  try {
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Loop for remaining pages
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Dynamic filename
    const parts = [
      getInsightState || "",
      getInsightsCity || "",
      newMonthContext || "",
      contextSpeciality || ""
    ].filter(Boolean);

    const filename = parts.length > 0
      ? `GMB_Performance_Report_${parts.join("_")}.pdf`
      : "GMB_Performance_Report.pdf";

    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation failed:", error);
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
  //     newMonthContext || "",
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
        "Phone Calls",
        "Reviews",
        "Rating",
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
      newMonthContext || "",
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
        locationProfiles,
        setLocationProfiles,
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
        setContextDepartment,
        contextDepartment,
        setContextSpeciality,
        contextSpeciality,
        setContextRating,
        contextRating,
      }}
    >
      <div style={{ background: "#F8F8FB", minHeight: "100vh" }}>
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

        <div
          className="main-content"
          style={{
            marginLeft: isCollapsed ? "5rem" : "16rem",
            paddingTop: "1rem",
            transition: "margin-left 0.5s ease, padding-top 0.5s ease",
          }}
        >
          <div className="flex justify-end items-center p-4 mt-4 mr-4">
            <button
              className="flex items-center bg-white text-[#1565C0] border border-[#1565C0] rounded-lg px-4 py-2 mr-3 hover:bg-[#F0EFFF] transition-colors shadow-sm"
              onClick={downloadPDF}
            >
              <BsFiletypePdf className="mr-2" /> Export PDF
            </button>
            <button
              className="flex items-center bg-[#1565C0] text-white rounded-lg px-4 py-2 hover:bg-[#30839f] transition-colors shadow-md"
              onClick={downloadDataAsExcel}
            >
              <RiFileExcel2Fill className="mr-2" /> Export Excel
            </button>
          </div>

          {/* Root-level check for showAllData */}
          <div id="mainDashboardContent">
            {showAllData && showAllData.length !== 0 ? (
              <div className="px-8">
                {/* Overview Section */}
                <div className="bg-[#1565C0] rounded-xl py-2 shadow-lg mb-6">
                  <h3 className=" font-medium text-white text-center py-2">Overview</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-[#E5E3FF]">
                    {/* {deptDetails && (
                        <ContentContainer data={deptDetails} />
                    )} */}

                    {use && (
                      <ContentContainer data={use} />
                    )}
                  </div>
                </div>

                {/* Performance Section */}
                <div className="bg-[#1565C0] rounded-xl py-2 shadow-lg mb-6">
                  <h3 className="font-medium text-white text-center py-2">Performance</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                  {/* Review Rating Card */}
                  <div className="bg-white rounded-xl shadow-md p-6 border border-[#E5E3FF]">
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
                    )}
                  </div>

                  {/* Analysis Card */}
                  <div className="bg-white rounded-xl shadow-md p-6 border border-[#E5E3FF] lg:col-span-4">
                    {showAllData?.analysis?.length > 0 ? (
                      <SideContentContainer data={showAllData.analysis} />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No analysis data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#E5E3FF] mb-8 p-4">
                  {!isLoading && showAllData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CombinedLineChart
                        data={{
                          "Overall Searches": showAllData?.combinedGraphData?.[0],
                        }}
                      />
                      {/* <CombinedLineChart
                        data={{
                          "Mobile (Searches + Maps)": showAllData?.graphDataSearchesMobils?.[0],
                        }}
                      /> */}

                      <CombinedLineChart
                        data={{
                          "Google Search Mobile": showAllData?.graphDataSearchesMobils?.[0],
                          "Google Maps mobile": showAllData?.graphDataMapsMobils?.[0],
                        }}
                      />
                      {/* <CombinedLineChart
                        data={{
                          "Desktop (Searches + Maps)": showAllData?.graphDataSearches?.[0],
                        }}
                      /> */}
                      <CombinedLineChart
                        data={{
                          "Google Search Desktop": showAllData?.graphDataSearches?.[0],
                          "Google Maps Desktop": showAllData?.graphDataMapsDesktop?.[0],
                        }}
                      />
                      <CombinedLineChart
                        data={{
                          "Website Clicks": showAllData?.graphDataWebsiteClicks?.[0],
                        }}
                      />
                      <CombinedLineChart
                        data={{
                          Directions: showAllData?.directions?.[0],
                        }}
                      />
                      <CombinedLineChart
                        data={{
                          Calls: showAllData?.graphDataCalls?.[0],
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-[#E5E3FF] h-12 w-12"></div>
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-[#E5E3FF] rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-[#E5E3FF] rounded"></div>
                            <div className="h-4 bg-[#E5E3FF] rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {/* Top Doctors Section */}
                <div className="mb-8">
                  <TopDoctor contextHospitals={contextHospitals} newMonthContext={newMonthContext} />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
                  <p className="text-[#6A6792] font-medium">Loading dashboard data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div id="pdf-clone-container" style={{ display: 'none' }}></div>
    </SharedContext.Provider>
  );
}