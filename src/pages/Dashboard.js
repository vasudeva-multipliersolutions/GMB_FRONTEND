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
      console.log("1234🎉✨🎉🎉 : " + response.status);



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

      console.log("000000-----00000000000) : " + stateToSend);
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
        console.log("Branch@@@@@@@@ : " + Branch);
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



  console.log("Location Profiles--0-- : ", currentCluster);
  useEffect(() => {
    //getMonthData("");
  }, [reload]);
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

        {/* Root-level check for showAllData */}
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
                <div className="d-flex justify-content-center align-items-center">No analysis data available</div>
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
                        callsGraphData={showAllData.graphDataCalls[0]}
                        bcolor={"#FFFFFF"}
                        width={"50%"}
                      />
                    )}
                    {showAllData?.graphDataSearches?.length > 0 && (
                      <GraphicalContainer
                        gtype={"ColumnChart"}
                        averageBlock={true}
                        title={"Searches"}
                        callsGraphData={showAllData.graphDataSearches[0]}
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
                        callsGraphData={showAllData.graphDataSearchesMobils[0]}
                        bcolor={"#FFFFFF"}
                        width={"50%"}
                      />
                    )}
                    {showAllData?.graphDataWebsiteClicks?.length > 0 && (
                      <GraphicalContainer
                        gtype={"ColumnChart"}
                        averageBlock={true}
                        title={"Website Clicks"}
                        callsGraphData={showAllData.graphDataWebsiteClicks[0]}
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
    </SharedContext.Provider>
  );
}