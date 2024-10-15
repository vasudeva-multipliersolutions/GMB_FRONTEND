//TopDoctor
import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import InsightDetails from "../pages/InsightsDetails"
import { SharedContext } from "../context/SharedContext";
import TopDOctorDetails from "./TopDoctorDetails";
export default function TopDoctor() {
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
          <Navbar logoimg={logo} username={username} serach={false} topdoc={true} blockmenu={ true}></Navbar>
        <TopDOctorDetails></TopDOctorDetails>
      
    </Fragment>
  );
}
