import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import BasicDetailsComponent from "../components/BasicDetailsComponent";
import { SharedContext } from "../context/SharedContext";
export default function DocReport() {
  var username;
  const [locationProfiles, setLocationProfiles] = useState([]);
  const [contextHospitals, setcontextHospitals] = useState();
  const mail = localStorage.getItem("mail");


  const [getDrName, setDrName] = useState("");
  const [analysisData, setAnalysisData] = useState();
  const userlogo = localStorage.getItem("username");
  // alert(userlogo)
  const psw1 = localStorage.getItem("psw");
  const logo = userlogo == "Manipal" ? manipalLogo : careLogo;
  return (
    <Fragment>
      <SharedContext.Provider value={{ getDrName, setDrName , setLocationProfiles, setcontextHospitals}}>
        <Navbar logoimg={logo} username={username}  filterpopover={true} ></Navbar>
        <BasicDetailsComponent></BasicDetailsComponent>
      </SharedContext.Provider>
    </Fragment>
  );
}
