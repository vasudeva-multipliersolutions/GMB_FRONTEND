// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


import React, { Fragment, useEffect, useState, useContext } from "react";
import logoutlogo from "../assets/Logos/logout.png";
import { useNavigate, Link } from "react-router-dom";
import { SharedContext } from "../context/SharedContext";
import { FaCircleRight } from "react-icons/fa6";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { FaCaretRight } from "react-icons/fa";

export default function Navbar(props) {
  const { setDrName } = useContext(SharedContext);
  const { setContextCity, setLocationProfiles } = useContext(SharedContext);
  const { setInsightsState, setInsightsCity } = useContext(SharedContext);
  const navigate = useNavigate();
  const [getAllnames, setAllNames] = useState();
  const [getName, setName] = useState();
  const [getState, setState] = useState();
  const [getStates, setStates] = useState();
  const [getCity, setCity] = useState();
  const [getCitys, setCitys] = useState();
  const api = localStorage.getItem("API");
  const [logo, setLogo] = useState("");
  const [email, setEmai] = useState("");
  const [isNavContentsVisible, setNavContentsVisible] = useState(true);

  // const [check, setCheck] = useState(0);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
  }

  function logoutHandeler() {
    // alert('hello world')
    localStorage.removeItem("API");
    localStorage.removeItem("logo");
    localStorage.removeItem("username");
    localStorage.removeItem("psw");
    //console.log("logged out before navifated");
    navigate("/");
    //console.log("logged out after navifated");
  }
  function nameHandelar(e) {
    setName(e.target.value);
  }
  function cityInsightHandelar(e) {
    setCity(e.target.value);
  }
  function stateInsiteHandelar(e) {
    setState(e.target.value);
  }
  function nameseter() {
    setDrName(getName);
  }
  async function getStateHandeler(e) {
    setState(e.target.value);
    // filterApi()
  }

  function toggleNavContents() {
    setNavContentsVisible(!isNavContentsVisible);
  }

  async function filterApi() {
    try {
      const response = await fetch(`${api}/getfilterdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: getState, branch: getCity }),
      });
      const data = await response.json();

      setLocationProfiles(data.countOfProfiles);
      setCitys(data.result[0].branches);
      setAllNames(data.result[0].businessNames);

      if (props.serach) {
        setContextCity(getCity);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  function Insightsapicall() {
    setInsightsState(getState);
    setInsightsCity(getCity);
    //console.log("Insight api call...........", setInsightsState, "@", getCity);
  }
  function insightsChecker() {
    if (props.insights) {
      Insightsapicall();
    }
  }

  useEffect(() => {
   // console.log("Current path:", window.location.pathname);
    // Your other code here
  }, []);

  function getCityHandeler(e) {
    setCity(e.target.value);
  }

  useEffect(() => {
    async function getAllDoctrosNames() {
      const docNames = await fetch("" + api + "/getAllDocNames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allNames = await docNames.json();

      setAllNames(allNames);
    }
    async function getallLoc() {
      const locDetails = await fetch("" + api + "/getunquelocdata", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const getlocdetails = await locDetails.json();
      //console.log("check it --------------------->", getlocdetails);
      setStates(getlocdetails[0].states);
      setCitys(getlocdetails[0].branches);
    }
    getallLoc();
    getAllDoctrosNames();

    const logo = localStorage.getItem("logo");
    if (logo) {
      setLogo(logo);
    }

    const mail = localStorage.getItem("mail");
    if (mail) {
      setEmai(mail);
    }
    // const exportBulkEditBtn = document.getElementsByClassName("export-btn");
    // for (let i = 0; i < exportBulkEditBtn.length; i++) {
    //   exportBulkEditBtn[i].disabled = true;
    // }
  }, [getCity, getState]);
  // if(getLoc)
  // {
  //   console.log(getLoc)
  // }
  // alert(email);
  const exportExcel = (excelData) => {
    const title = "Doctor Details";
    // const details = excelData.result[0]["details"];
    const details = excelData.result[0]["details"].map((detail) => ({
      ...detail,
      businessName: detail.businessName.split("|")[0].trim(),
    }));

    // Column header mapping for aliasing
    const columnMapping = {
      businessName: "Dr Name",
      googleSearchMobile: "GS - Mobile",
      googleSearchDesktop: "GS - Desktop",
      googleMapsMobile: "GM - Mobile",
      googleMapsDesktop: "GM - Desktop",
      calls: "Phone Calls",
      directions: "Direction Clicks",
      websiteClicks: "Website Clicks",
      month: "Month",
      state: "State",
      branch: "Branch",
    };

    const columnOrder = [
      "businessName",
      "googleSearchMobile",
      "googleSearchDesktop",
      "googleMapsMobile",
      "googleMapsDesktop",
      "calls",
      "directions",
      "websiteClicks",
      "month",
      "state",
      "branch",
    ];

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("details");
    worksheet.properties.outlineLevelCol = 2;
    worksheet.properties.defaultRowHeight = 55;

    // Adding Header Row
    let header = columnOrder.map((col) => columnMapping[col]);
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "b7274c" },
      };

      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
        size: 12,
        vertAlign: "superscript",
      };
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Adding Data Rows
    details.forEach((row, rowIndex) => {
      let rowData = columnOrder.map((col) => row[col] ?? ""); // Ensure an empty string if the value is missing
      let excelRow = worksheet.addRow(rowData);
      excelRow.eachCell((cell, number) => {
        cell.font = {
          vertAlign: "superscript",
          size: 12,
        };
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    worksheet.eachRow((row, rowNumber) => {
      row.height = 55;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, title + ".xlsx");
    });
  };

  async function getAllDoctrosDetails(getState, getCity) {
    const docDetails = await fetch("" + api + "/getAllDocDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: getState, branch: getCity }),
    });
    const allDetails = await docDetails.json();
    //console.log("All Doctor details State and branch wise : ", allDetails);
    exportExcel(allDetails);
  }
  function bulkExport() {
    getAllDoctrosDetails(getState, getCity);
  }
  return (
    <Fragment>
      <div className="navigation-bar ">
        <div className="nav-logo">
          <img src={logo} alt="logo"></img>
        </div>
        <div className="nav-caption">GOOGLE MY BUSINESS PERFORMANCE</div>
        
        <div className="nav-l">
        <div
          className="menu-button"
          onClick={() => setNavContentsVisible(!isNavContentsVisible)}
        >
          <i class="bi bi-list"></i>
        </div>
          <div className="logout-icon"><i
            class="bi bi-box-arrow-in-right"
            
            onClick={logoutHandeler}
          ></i></div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="sub-nav p-3 ">
        <div
          className={`filter-contents  ${
            isNavContentsVisible ? "show" : ""
          }`}
          style={{ display: props.worktracker ? "none" : "block" }}
        >
          <div className="filers_sprding">
            <div className="data_list_selection m-1">
              <input
                value={getState}
                onChange={getStateHandeler}
                list="statelist"
                placeholder="Select State"
                onInputCapture={stateInsiteHandelar}
                style={{
                  width: "150px",
                  borderRadius: " 10px 0px 0 10px",
                  padding: "4px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={() => {
                  filterApi();
                  insightsChecker();
                }}
                style={{
                  // display:
                  //   email === "aristro@gmail.com" ||
                  //   email === "microlabs@gmail.com"
                  //     ? "none"
                  //     : "",
                  borderRadius: " 0px 10px 10px 0px",
                  backgroundColor: "#02B9AD",
                }}
              >
                <FaCircleRight className="CircleRightIcon"/>
                {/* <FaCaretRight className="CircleRightIcon" /> */}
              </button>
            </div>

            <datalist id="statelist">
              {getStates &&
                getStates.map((item) => {
                  if (item != "#N/A")
                    return <option value={item}>{item}</option>;
                })}
            </datalist>
            <div className="data_list_selection m-1">
              <input
                value={getCity}
                onChange={getCityHandeler}
                list="Cityeslist"
                placeholder="Select City"
                onInputCapture={cityInsightHandelar}
                style={{
                  width: "150px",
                  borderRadius: " 10px 0px 0 10px",
                  padding: "4px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={() => {
                  filterApi();
                  insightsChecker();
                }}
                style={{
                  borderRadius: " 0px 10px 10px 0px",
                  backgroundColor: "#02B9AD",

                  // display:
                  //   email === "aristro@gmail.com" ||
                  //   email === "microlabs@gmail.com"
                  //     ? "none"
                  //     : "",
                }}
              >
                <FaCircleRight className="CircleRightIcon"
                
                
                />
              </button>
            </div>
            <datalist id="Cityeslist">
              {getCitys &&
                getCitys.map((item) => {
                  if (item != "#N/A")
                    return <option value={item}>{item}</option>;
                })}
            </datalist>
            {/* <label>Select Doctor:</label>&nbsp; */}
            <div
              className="data_list_selection m-1"
              style={{ display: !props.serach ? "block" : "none" }}
            >
              <input
                type="text"
                list="getDoctor"
                placeholder="Doctor Name"
                value={getName}
                onInputCapture={nameHandelar}
                style={{
                  width: "150px",
                  borderRadius: " 10px 0px 0 10px",
                  padding: "4px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={nameseter}
                style={{
                  borderRadius: " 0px 10px 10px 0px",
                  backgroundColor: "#02B9AD",
                  // display:
                  //   email === "aristro@gmail.com" ||
                  //   email === "microlabs@gmail.com"
                  //     ? "none"
                  //     : "",
                }}
              >
                <FaCircleRight className="CircleRightIcon"
                  
                />
              </button>
            </div>
            {getAllnames && (
              <datalist id="getDoctor">
                {getAllnames.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </datalist>
            )}
                  </div>
                  


                  
        </div>
        {isNavContentsVisible && (
          <div
            className={`nav-contents ${isNavContentsVisible ? "show" : ""}`}
          >
            <p
              style={{ display: email !== "care@gmail.com" ? "none" : "block" }}
            >
              <button
                className="export-btn"
                style={{
                  display: !props.serach ? "block" : "none",
                }}
                onClick={bulkExport}
                disabled={!getState}
              >
                Bulk Download
              </button>
            </p>
            <Link to="/Dashboard" className="p-1 pe-5">
              Dashboard
            </Link>
            <Link to="/Doc-report" className="p-1 pe-5">
              Doc Report
            </Link>
            <Link to="/Insights" className="p-1 pe-5">
              Insights
            </Link>
            {email === "astrio@gmail.com" ||
            email === "lupin@gmail.com" ||
            email === "care@gmail.com" ||
            email === "mankind@gmail.com" ? (
              <Link to="/WorkTracker " className="p-1 pe-5">
                WorkTracker
              </Link>
            ) : (
              <Link to="/Matrics" className="p-1 pe-5">
                Metrics
              </Link>
            )}

            {/* <Link to="/Review-management" className="p-1 pe-5">
            Review Management
          </Link>  */}
            {/* <Link to="/Review Management" className="p-1 pe-5" style={{display: (props.username === 'Manipal' && props.serach ? 'none' : 'block')}}>Review Management</Link> */}
            {/* <Link to="/gen-ai" className="p-1 pe-5" style={{display: (props.username === 'Manipal' && props.serach ? 'none' : 'block')}}>Gen AI</Link>  */}
          </div>
        )}
      </div>
    </Fragment>
  );
}

