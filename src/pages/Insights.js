import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import InsightDetails from "../pages/InsightsDetails"
import { SharedContext } from "../context/SharedContext";
export default function DocReport() {
  var username;
  const [locationProfiles, setLocationProfiles] = useState([]);

  const [getInsightState, setInsightsState] = useState([]);
  const [getInsightsCity, setInsightsCity] = useState([]);
  const [contextHospitals, setcontextHospitals] = useState();
  const [getDrName, setDrName] = useState("");
  const userlogo = localStorage.getItem("username");
  const mail = localStorage.getItem("mail");
  // alert(userlogo)
  const psw1 = localStorage.getItem("psw");
  const logo = userlogo == "Manipal" ? manipalLogo : careLogo;

 
  return (
    <Fragment>
      <SharedContext.Provider value={{getInsightState, setInsightsState, getInsightsCity, contextHospitals, setcontextHospitals, setInsightsCity, getDrName, setDrName , setLocationProfiles}}>
        <Navbar logoimg={logo} username={username} serach={mail === "manipal@gmail.com" ? true : false} insights={true}></Navbar>
        <InsightDetails></InsightDetails>
      </SharedContext.Provider>
    </Fragment>
  );
}
