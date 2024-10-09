import React, { useContext, useEffect, useState } from "react";
import "../stylesheets/dashboard.css";
import TableComponent from "../components/TableComponent";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import Navbar from "../components/Navbar";
import ContentContainer from "../components/ContentContainer";
import ReviewRating from "../components/ReviewRating";
import GraphicalContainer from "../components/GraphicalContainer";
import { SharedContext } from "../context/SharedContext";
import { useNavigate } from "react-router-dom";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { Container } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { SidebarContext } from "../SidebarContext";
import SideContentContainer from "../components/SideContentContainer";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const [showAllData, setAllData] = useState(null);
  const [analysisData, setAnalysisData] = useState();
  const [contextCity, setContextCity] = useState();
  const [contextMonth, setContextMonth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [use, setUse] = useState([]);
  const { isCollapsed } = useContext(SidebarContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


 

  const username1 = localStorage.getItem("username");
  const psw1 = localStorage.getItem("psw");
  const api = localStorage.getItem("API");

  async function getAllData(branch) {
    try {
      const response = await fetch(`${api}/${branch}`);
      const data = await response.json();
      console.log("1234 : "+data[0])
      setAllData(data);
      console.log(
        "+++++++++++++++++ data:" + data.reviewRating[0].averagerating
      );
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }




  async function getMonthData(month) {
    try {
      const response = await fetch(`${api}/monthdata/${month}`);
      const data = await response.json();
      setAllData(data);
      console.log(
        "+++++++++++++++++ data:" + data.reviewRating[0].averagerating
      );
      console.log(
        "333333333333 data:" + data.analysis[0]
      );
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        const response = await fetch("http://localhost:2024/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username1, psw: psw1 }),
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

    getAnalysisData();
    getAllData("No");

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, username1, psw1, api]);

  useEffect(() => {
    if (locationProfiles && locationProfiles[0]) {
      const verificationData = [
        {
          "Total Profiles":
            locationProfiles[0]["Total Profiles"] -
            locationProfiles[0]["Need Access"],
        },
        { "Verified Profiles": locationProfiles[0]["Verified Profiles"] },
        { "Unverified Profiles": locationProfiles[0]["Unverfied Profiles"] },
        { "Not Intrested": locationProfiles[0]["Not Intrested"] },
      ];
      setUse(verificationData);
    } else if (analysisData && analysisData[0]) {
      const verificationData = [
        { "Total Profiles": analysisData[0]["Total Profiles"] },
        { "Verified Profiles": analysisData[0]["Total Verified"] },
        { "Unverified Profiles": analysisData[0]["Unverified"] },
        { "Not Intrested": analysisData[0]["Not Intrested"] },
      ];
      setUse(verificationData);
    }
  }, [analysisData, locationProfiles]);

  useEffect(() => {
    console.log("getContextCity@@@@@@@@ : "+contextCity);
    if (contextCity) {
      getAllData(contextCity);
    }
  }, [contextCity]);

  useEffect(() => {
    console.log("getContextMonth@@@@@@@@ : "+contextMonth);
    if (contextMonth) {
      getMonthData(contextMonth);
    }
  }, [contextMonth]);

  const username = analysisData?.[0]?.user;
  const logo = username === "Manipal" ? manipalLogo : careLogo;

  return (
    <SharedContext.Provider
      value={{
        contextCity,
        setContextCity,
        locationProfiles,
        setLocationProfiles,
        setContextMonth
      }}
    >
      <div className="Container-fluid" style={{ background: "#EFEFEF" }}>
        <Navbar logoimg={logo ? logo : ""} username={username} serach={true} />
        {use && <ContentContainer data={use} />}
        <div
          className="content-container-1 "
          style={{
            marginLeft:
            windowWidth > 768 ? (isCollapsed ? "5%" : "20%") : 0,
            transition: "margin-left 0.5s ease",
          }}
        >
          <div className="left-container m-2">
            {showAllData && (
              <ReviewRating
                review={showAllData?.reviewRating[0]?.totalreviews}
                rating={showAllData?.reviewRating[0]?.averagerating}
              />
            )}
          </div>

          {showAllData && <SideContentContainer data={showAllData.analysis} />}
        
        </div>
         <div className="grapharea" style={{
            marginLeft:
            windowWidth > 768 ? (isCollapsed ? "5%" : "20%") : 0,
            width:
            windowWidth > 768 ? (isCollapsed ? "95%" : "80%") : 0,
            transition: "margin-left 0.5s ease",
          }}>
        <div className="right-container "   >
            {isLoading ? (
              <ShimmerThumbnail height={420} width={2000} rounded />
            ) : (
              showAllData && (
                <>
                  <GraphicalContainer
                    gtype={"Bar"}
                    title={"Calls"}
                    callsGraphData={showAllData.graphDataCalls[0]}
                    bcolor={"#FFFFFF"}
                    width={"50%"}
                  />
                  <GraphicalContainer
                    gtype={"Bar"}
                    title={"Searches"}
                    callsGraphData={showAllData.graphDataSearches[0]}
                    bcolor={"#FFFFFF"}
                    width={"50%"}
                  />
                </>
              )
            )}
        </div>
        <div className="right-container "   >
            {isLoading ? (
              <ShimmerThumbnail height={420} width={2000} rounded />
            ) : (
              showAllData && (
                <>
                  <GraphicalContainer
                    gtype={"Bar"}
                    title={"Mobile Searches"}
                    callsGraphData={showAllData.graphDataSearchesMobils[0]}
                    bcolor={"#FFFFFF"}
                    width={"50%"}
                  />
                  <GraphicalContainer
                    gtype={"Bar"}
                    title={"Website Clicks"}
                    callsGraphData={showAllData.graphDataWebsiteClicks[0]}
                    bcolor={"#FFFFFF"}
                    width={"50%"}
                  />
                </>
              )
            )}
          </div>
          </div>
        <br />
      </div>
    </SharedContext.Provider>
  );
}
