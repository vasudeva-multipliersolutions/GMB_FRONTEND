import React, { useContext } from "react";
import "../stylesheets/dashboard.css";
import TableComponent from "../components/TableComponent";
import { useEffect, useState } from "react";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import Navbar from "../components/Navbar";
import ContentContainer from "../components/ContentContainer";
import ReviewRating from "../components/ReviewRating";
import GraphicalContainer from "../components/GraphicalContainer";
import { SharedContext } from "../context/SharedContext";
import { json } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { MdNotInterested } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAllData, setAllData] = useState(null);
  const [analysisData, setAnalysisData] = useState();
  const [contextCity, setContextCity] = useState();
  const [isloading, setIsLoading] = useState(true);
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [use,setUse] = useState([])


  const username1 = localStorage.getItem("username");
  const psw1 = localStorage.getItem("psw");
  const api = localStorage.getItem("API");
  var username;
  var logo;

  // const object = locationProfiles?.map((values) => {
  //   return {values}
  // });

  async function getAllData(branch) {
    console.log(`${api}/${branch}`);
    const allData = await fetch(`${api}/${branch}`);
    const response = await allData.json();
    setAllData(response);
    console.log("======================: ", response);
  }

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
      const analysisData = await fetch(
        "https://googlemybusiness.gmbapi.multipliersolutions.in/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ username: username1, psw: psw1 }),
        }
      );
      const result = await analysisData.json();
      console.log(username1, psw1);
      console.log(result);
      setAnalysisData(result);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    getAnalysisData();

    getAllData("No");

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  // username = analysisData[0]?.user;
  // logo = username == "Manipal" ? manipalLogo : careLogo;

   useEffect(()=>{

     
    
    if (locationProfiles && locationProfiles[0])
    {
       locationProfiles?.map((object) => {
        const verificationData = [
        { "Total Profiles": object["Total Profiles"]-object["Need Access"] },
        { "Verified Profiles": object["Verified Profiles"] },
        { "Unverified Profiles": object["Unverfied Profiles"] },
        { "Not Intrested": object["Not Intrested"] },
      ];
      setUse(verificationData)})
      
    }
    else if(analysisData && analysisData[0])
    {
      // if (username != "Care") {
      //   verificationData.push({
      //     "Not Intrested": analysisData[0]["Not Intrested"],
      //   });
      // } else {
      //   verificationData.push({ Access: analysisData[0]["Not Intrested"] });
      // }

      

   const   verificationData = [
        { "Total Profiles": analysisData[0]["Total Profiles"] },
        { "Verified Profiles": analysisData[0]["Total Verified"] },
        { "Unverified Profiles": analysisData[0]["Unverified"] },
        { "Not Intrested": analysisData[0]["Not Intrested"] },
      ]
setUse(verificationData)
    }
    else {
      return 
    }
  }, [analysisData,locationProfiles])
  // {

  //   if (locationProfiles && locationProfiles[0])
  //   {
  //     return (verificationData = profilesOfDoctorsOnLocation);
  //   }
  //   else if(analysisData && analysisData[0])
  //   {
  //     // if (username != "Care") {
  //     //   verificationData.push({
  //     //     "Not Intrested": analysisData[0]["Not Intrested"],
  //     //   });
  //     // } else {
  //     //   verificationData.push({ Access: analysisData[0]["Not Intrested"] });
  //     // }

  //     return (verificationData = [
  //       { "Total Profiles": analysisData[0]["Total Profiles"] },
  //       { "Verified Profiles": analysisData[0]["Total Verified"] },
  //       { "Unverified Profiles": analysisData[0]["Unverified"] },
  //       { "Not Intrested": analysisData[0]["Not Intrested"] },
  //     ]);
  //   }
  //   else {
  //     return
  //   }
  // }
  

  useEffect(() => {
    if (contextCity) {
      // alert(contextCity);
      return getAllData(contextCity);
    }
  }, [contextCity]);

  return (
    // <div style={{background: 'linear-gradient(to right, #07509D 119.23%, 180deg, #30C3BB 0%)'}}>
    <SharedContext.Provider
      value={{
        contextCity,
        setContextCity,
        locationProfiles,
        setLocationProfiles,
      }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #07509D 0%, #30C3BB 100%)",
        }}
      >
        <Navbar logoimg={logo?logo:''} username={username} serach={true}></Navbar>
        {use && (
          <ContentContainer data={use}></ContentContainer>
        )}
        <div className="content-container-1 m-3">
          <div className="left-container m-1">
            {showAllData && (
              <ReviewRating
                review={showAllData?.reviewRating[0]?.totalreviews}
                rating={showAllData?.reviewRating[0]?.averagerating / 95}
              ></ReviewRating>
            )}
          </div>
          <div className="right-container m-1">
            {isloading ? (
              <ShimmerThumbnail height={420} width={2000} rounded />
            ) : (
              showAllData && (
                <>
                  <GraphicalContainer
                    gtype={"AreaChart"}
                    title={"Calls"}
                    callsGraphData={showAllData.graphDataCalls[0]}
                    bcolor={"#b1efec"}
                    width={"50%"}
                  ></GraphicalContainer>
                  <GraphicalContainer
                    gtype={"AreaChart"}
                    title={"Searches"}
                    callsGraphData={showAllData.graphDataSearches[0]}
                    bcolor={"#b1efec"}
                    width={"50%"}
                  ></GraphicalContainer>
                </>
              )
            )}
          </div>
        </div>
        {showAllData && (
          <ContentContainer data={showAllData.analysis}></ContentContainer>
        )}
        {/* <div style={{ display: (username === 'Manipal' ? 'block' : 'none') }}>
                    <div className="content-container-3 m-2">
                        <TableComponent title="Top Five Unit Searches" />
                        <TableComponent title="Top Five Doctor Searches"></TableComponent>
                    </div>
                </div>
                <div style={{ display: (username !== 'Manipal' ? 'block' : 'none') }}>
                    <div className="content-container-3 m-2">
                        {tableData && 
                            <TableComponent title="Top Five Doctor Searches" data={tableData}></TableComponent>
                        }
                    </div>
                </div> */}
        <br />
      </div>
    </SharedContext.Provider>
  );
}
