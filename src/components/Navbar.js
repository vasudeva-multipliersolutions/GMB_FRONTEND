import React, { Fragment, useEffect, useState, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";
import { SharedContext } from "../context/SharedContext";
import { FaAlignJustify, FaAnglesLeft, FaDashcube } from "react-icons/fa6";

import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { FaChartBar, FaSearch, FaUserMd } from "react-icons/fa";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { MdTableChart } from "react-icons/md";
import { GiTimeBomb } from "react-icons/gi";
import { SidebarContext } from "../SidebarContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FilterPopover, { NewMenuBar } from "./FilterPopover";



export default function Navbar(props) {
  const { isCollapsed, toggleSidebar, drNameContext } =
    useContext(SidebarContext); // Use the correct context
  const { setDrName } = useContext(SharedContext);
  const { setContextCity, setLocationProfiles, setContextMonth } =
    useContext(SharedContext);
  const { setInsightsState, setInsightsCity } = useContext(SharedContext);
  const navigate = useNavigate();
  const [getAllnames, setAllNames] = useState();
  const [getName, setName] = useState();
  const [getState, setState] = useState();
  const [getStates, setStates] = useState();
  const [getCity, setCity] = useState();
  const [getCitys, setCitys] = useState();
  const [getMonth, setMonth] = useState();
  const api = localStorage.getItem("API");
  const user = localStorage.getItem("user");
  const [logo, setLogo] = useState("");
  const [email, setEmai] = useState("");
  const [isNavContentsVisible, setNavContentsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const [check, setCheck] = useState(0);

  for (let i = 0; i < localStorage.length; i++) {
    //const key = localStorage.key(i);
    //const value = localStorage.getItem(key);
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

  // function toggleSidebar() {
  //   setIsCollapsed(!isCollapsed);
  // }

  useEffect(() => {
    const storedLogo = localStorage.getItem("logo");

    if (storedLogo) setLogo(storedLogo);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function nameHandelar(e) {
    setName(e.target.value);
  }
  function cityInsightHandelar(e) {
    setCity(e.target.value);
  }
  function stateInsiteHandelar(e) {
    setState(e.target.value);
    setCity("");
  }
  function nameseter() {
    setDrName(getName);
  }
  async function getStateHandeler(e) {
    setState(e.target.value);
    setCity("");
    filterApi();
  }

  function monthHandelar(e) {
    setMonth(e.target.value);
  }

  function monthseter() {
    setContextMonth(getMonth);
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
      if (data.result[0].branches && data.result[0].branches.length > 0) {
        setCitys(data.result[0].branches);
      }
      setAllNames(data.result[0].businessNames);

      if (!props.serach) {
        setContextCity(getCity);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function Insightsapicall() {
    setInsightsState(getState);
    setInsightsCity(getCity);
    //console.log("Insight api call..........." +setInsightsState+ "@" +getCity);
  }
  function insightsChecker() {
    if (props.insights || props.topdoc) {
      Insightsapicall();
      // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    }
  }

  useEffect(() => {
    //console.log("Current path:", window.location.pathname);
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
  }, [getState]);

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
      {/* Sidebar */}

      <div >
        <Sidebar
          collapsed={isCollapsed}
          className={isCollapsed ? "sidebar-transparent" : ""}
          style={{
            height: "100%",
            position: "fixed",
            top: "0",
            transition: "width 0.5s ease",
        
          }}
        >
          <Menu iconShape="square"   className = "sidemenu">
            <MenuItem
              icon={isCollapsed ? <FaAlignJustify /> : <FaAnglesLeft />}
              onClick={() => toggleSidebar()}
            >
              <img src={logo} />
            </MenuItem>

            <MenuItem
              className="menu-item"
              icon={<FaDashcube />}
              onClick={() => navigate("/Dashboard")}
            >
              {isCollapsed && <span className="tooltip">Dashboard</span>}
              <Link to="/Dashboard">Dashboard</Link>
            </MenuItem>

            <MenuItem
              className="menu-item"
              icon={<FaUserMd />}
              onClick={() => navigate("/Doc-report")}
            >
              {isCollapsed && <span className="tooltip">Doc Report</span>}
              <Link to="/Doc-report">Doc Report</Link>
            </MenuItem>

            <MenuItem
              className="menu-item"
              icon={<FaChartBar />}
              onClick={() => navigate("/Insights")}
            >
              {isCollapsed && <span className="tooltip">Insights</span>}
              <Link to="/Insights">Insights</Link>
            </MenuItem>

            {[
              "astrio@gmail.com",
              "lupin@gmail.com",
              "care@gmail.com",
              "mankind@gmail.com",
            ].includes(email) ? (
              <MenuItem
                className="menu-item"
                icon={<GiTimeBomb />}
                onClick={() => navigate("/WorkTracker")}
              >
                {isCollapsed && <span className="tooltip">Work Tracker</span>}
                <Link to="/WorkTracker">Work Tracker</Link>
              </MenuItem>
            ) : (
              <MenuItem
                className="menu-item"
                icon={<MdTableChart />}
                onClick={() => navigate("/Matrics")}
              >
                {isCollapsed && <span className="tooltip">Metrics</span>}
                <Link to="/Matrics">Metrics</Link>
              </MenuItem>
            )}
          </Menu>
        </Sidebar>
      </div>

      <div
        className="navigation-bar"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : "15%",
          transition: "margin-left 0.5s ease",
        }}
      >
        <div
          className="menu-button-1"
          onClick={() => setNavContentsVisible(!isNavContentsVisible)}
        >
          <i class="bi bi-list"></i>
        </div>
        <div className="nav-caption">GOOGLE MY BUSINESS PERFORMANCE</div>

        {/* <div className="logout-icon">
          <i className="bi bi-person-circle" onClick={logoutHandeler}></i>
        </div> */}

        <div className="logout-icon">
          <Button aria-describedby={id} onClick={handleClick}>
            <i className="bi bi-person-circle fa-3x"></i>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <Typography onClick={logoutHandeler} sx={{ p: 2 }}>
              Logout <i className="bi bi-person-circle"></i>
            </Typography>
          </Popover>
        </div>
      </div>

      {/* Page Content */}
      {!props.blockmenu && (
        <div
          style={{
            marginLeft:
              window.innerWidth > 768 ? (isCollapsed ? "8%" : "20%") : "20%",
            padding: window.innerWidth > 768 ? "10px" : 0,
            transition: "margin-left 0.5s ease",
          }}
        >
          {/* Place your page content here */}

          <div className="sub-nav me-4">
            <div
              className={`filter-contents  ${
                isNavContentsVisible ? "show" : ""
              }`}
              style={{
                display: props.worktracker ? "none" : "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="filers_sprding">
                <div className="data_list_selection m-1">
                  {!props.serach && (
                    <div className="input-group">
                      <select
                        value={getState}
                        onChange={getStateHandeler}
                        onInputCapture={stateInsiteHandelar}
                        style={{
                          width: "150px",
                          borderRadius: " 10px 0px 0 10px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <option value="">Select State...</option>
                        {getStates &&
                          getStates.map((item, index) => {
                            if (item != "#N/A")
                              return (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              );
                          })}
                      </select>

                      <button
                        onClick={() => {
                          filterApi();
                          insightsChecker();
                        }}
                        style={{
                          borderRadius: " 0px 10px 10px 0px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <FaSearch className="CircleRightIcon" />
                      </button>
                    </div>
                  )}
                </div>

                {!props.serach && (
                  <div className="data_list_selection m-1">
                    <div className="input-group">
                      <select
                        value={getCity}
                        onChange={getCityHandeler}
                        onInputCapture={cityInsightHandelar}
                        style={{
                          width: "150px",
                          borderRadius: " 10px 0px 0 10px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <option value="">Select City...</option>
                        {getCitys &&
                          getCitys.map((item, index) => {
                            if (item != "#N/A")
                              return (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              );
                          })}
                      </select>
                      <button
                        onClick={() => {
                          filterApi();
                          insightsChecker();
                        }}
                        style={{
                          borderRadius: " 0px 10px 10px 0px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <FaSearch className="CircleRightIcon" />
                      </button>
                    </div>
                  </div>
                )}
                {props.serach && (
                  <div
                    style={{
                      display: email == "care@gmail.com" ? "none" : "block",
                    }}
                  >
                    <NewMenuBar></NewMenuBar>
                  </div>
                )}

                {/* <label>Select Doctor:</label>&nbsp; */}
                <div
                  className="data_list_selection m-1"
                  style={{
                    display:
                      props.docreport || props.insights ? "block" : "none",
                  }}
                >
                  <div className="input-group">
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
                        border: "1px solid #ccc",
                        outline: "none",
                        // display:
                        //   email === "aristro@gmail.com" ||
                        //   email === "microlabs@gmail.com"
                        //     ? "none"
                        //     : "",
                      }}
                    >
                      <FaSearch className="CircleRightIcon" />
                    </button>
                  </div>
                </div>
                {(drNameContext?.length > 0 ? drNameContext : getAllnames) && (
                  <datalist id="getDoctor">
                    {(drNameContext?.length > 0
                      ? drNameContext
                      : getAllnames
                    ).map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
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
                  style={{
                    display: email !== "care@gmail.com" ? "none" : "block",
                  }}
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

            <div
              className="datepicker"
              style={{ display: props.monthfilter ? "block" : "none" }}
            >
              <div className="data_list_selection m-1">
                <div className="input-group">
                  <select
                    value={getMonth}
                    onChange={monthHandelar}
                    onInputCapture={monthHandelar}
                    style={{
                      width: "80%",
                      borderRadius: " 10px 0px 0 10px",
                      padding: "4px",
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                  >
                    <option value="">Select Month...</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                  </select>

                  <button
                    onClick={() => {
                      monthseter();
                    }}
                    style={{
                      borderRadius: " 0px 10px 10px 0px",
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                  >
                    <FaSearch className="CircleRightIcon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {props.children}
        </div>
      )}

      <div className="d-flex justify-content-center"></div>
    </Fragment>
  );
}
