import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import BasicDetailsComponent from "../components/BasicDetailsComponent";
import InsightDetails from "../pages/InsightsDetails"
import { SharedContext } from "../context/SharedContext";
export default function DocReport() {
  var username;
  const [locationProfiles, setLocationProfiles] = useState([]);

  const [getInsightState, setInsightsState] = useState([]);
  const [getInsightsCity, setInsightsCity] = useState([]);
  const [getDrName, setDrName] = useState("");
  const userlogo = localStorage.getItem("username");
  // alert(userlogo)
  const psw1 = localStorage.getItem("psw");
  const logo = userlogo == "Manipal" ? manipalLogo : careLogo;
  return (
    <Fragment>
      <SharedContext.Provider value={{getInsightState, setInsightsState, getInsightsCity, setInsightsCity, getDrName, setDrName , setLocationProfiles}}>
        <Navbar logoimg={logo} username={username} serach={false} insights={true}></Navbar>
        <InsightDetails></InsightDetails>
      </SharedContext.Provider>
    </Fragment>
  );
}
