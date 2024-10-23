import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import manipalLogo from "../assets/Logos/manipalLogo.png";
import careLogo from "../assets/Logos/careLogo.png";
import BasicDetailsComponent from "../components/BasicDetailsComponent";
import { SharedContext } from "../context/SharedContext";
import TopDoctorDetails from "../pages/TopDoctorDetails"

export default function TopDoctor({contextHospitals}) {
  var username;
  const userlogo = localStorage.getItem("username");
  // alert(userlogo)

  const logo = userlogo == "Manipal" ? manipalLogo : careLogo;
  return (
    <Fragment>
      
      <Navbar logoimg={logo} username={username} serach={false} topdoc={true} blockmenu={true}></Navbar>
      <TopDoctorDetails contextHospitals={contextHospitals}  ></TopDoctorDetails>  
        
    </Fragment>
  );
}
