import React, { Fragment, useEffect, useState, useContext } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { SharedContext } from "../context/SharedContext";
import { FaAlignJustify, FaAnglesLeft, FaDashcube } from "react-icons/fa6";
import { FaChartBar, FaSearch, FaUserMd } from "react-icons/fa";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { MdTableChart } from "react-icons/md";
import { GiTimeBomb } from "react-icons/gi";
import { SidebarContext } from "../SidebarContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NewMenuBar } from "./FilterPopover";
import { Bold } from "lucide-react";



export default function Navbar(props) {
  const mail = localStorage.getItem("mail");
  const loginBranch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");
  const { isCollapsed, toggleSidebar, drNameContext } =
    useContext(SidebarContext); // Use the correct context
  const { setDrName } = useContext(SharedContext);
  const { setContextCity, setLocationProfiles, setContextMonth, setInsightsAnalysis, setReloadCondition, } = useContext(SharedContext);
  const { setInsightsState, setInsightsCity, setContextYear, } = useContext(SharedContext);
  const navigate = useNavigate();
  const [getAllnames, setAllNames] = useState();
  const [getName, setName] = useState();
  const [getState, setState] = useState();
  const [getStates, setStates] = useState();
  const [getCity, setCity] = useState();
  const [getCitys, setCitys] = useState();
  const [getMonth, setMonth] = useState();
  const [getYear, setYear] = useState();
  const api = localStorage.getItem("API");
  const [logo, setLogo] = useState("");
  const [email, setEmai] = useState("");
  const [reload, setReload] = useState();
  const [isNavContentsVisible, setNavContentsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [getcountOfProfiles, setcountOfProfiles] = useState(null);
  const [currentCluster, setCurrentCluster] = useState();
  const [lastFiveMonth, setLastMonths] = useState();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSpeciaity, setselectedSpeciaity] = useState("");
  const [filteredMonths, setFilteredMonths] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const location = useLocation();
  

  const isActive = (path) => location.pathname === path;

  function yearHandler(e) {
    const year = e.target.value;
    setSelectedYear(year);
  }
  function specialityHandler(e) {
    const speciality = e.target.value;
    setselectedSpeciaity(speciality);
   
  }
  //console.log("Speciality24567: ", selectedSpeciaity);

  useEffect(() => {
      const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
    

    if (!selectedYear) {
      setFilteredMonths(monthNames.map(m => `${m}-2024`).concat(monthNames.map(m => `${m}-2025`)));
    } else {
      setFilteredMonths(monthNames.map(m => `${m}-${selectedYear}`));
    }
  }, [selectedYear]);

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
    localStorage.clear();
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

  function nameHandelar( e )
  {
    setName( e.target.value )
  }
  function nameseter()
  {
    setDrName(getName)
  }
  async function getStateHandeler( e )
  {
    setCity("")
    if (e.target.value === "All") {
      window.location.reload();
    }else {
      setState( e.target.value )
    }
    //filterApi()
  }
  function getCityHandeler( e )
  {
    setMonth("");
    setCity( e.target.value )
  }
  function monthHandelar( e )
  {
    setMonth( e.target.value )
  }

  useEffect(() => {
    if (getState) {
      filterApi();
    }
  }, [getState]);

  useEffect(() => {
    if (getCity) {
      //setContextCity(getCity);
      filterApi();
    }
  }, [getCity]); 

//   useEffect(() => {
//   if (getcountOfProfiles) {
//     console.log("Updating setLocationProfiles with:", getcountOfProfiles);
//     setLocationProfiles(getcountOfProfiles);
//   }
// }, [getcountOfProfiles]); 

  async function filterApi()
  {
    // alert(getState)
    let cityToSend = getCity === "All" ? "" : getCity;
    const response = await fetch(api + '/getfilterdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "state": getState, "branch": cityToSend })
    });
    const data = await response.json();
    // alert("Hello")
    //console.log("datacountOfProfiles: ",data.result[0].countOfProfiles)
    setAllNames(data.result[0].businessNames)
    if (data.result[0].branches) {
    setCitys(data.result[0].branches)
    }

    if (data.countOfProfiles && data.countOfProfiles.length > 0) {
      console.log("New countOfProfiles:", data.countOfProfiles);
      setcountOfProfiles([...data.countOfProfiles]); // Ensure new array reference
    }
    //setContextCity(getCity)

    // if(props.serach)
    // {
    //   setContextCity(getCity)
    // }
  }

  useEffect(() => {
    async function getAllDoctrosNames()
    {
      const docNames = await fetch(api + '/getAllDocNames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const allNames = await docNames.json()
      // alert(allNames)
      setAllNames(allNames)
    }
    async function getallLoc()
    {
      const locDetails = await fetch(api + '/getunquelocdata', {
        method: "post" ,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const getlocdetails = await locDetails.json()
      setStates(getlocdetails[0].states)
    //setCitys(getlocdetails[0].branches)
  
    }
    if (mail === "manipal@gmail.com")
    {
    getallLoc()
    getAllDoctrosNames()
    } else {
      if (loginBranch === "undefined") {
        setState(Cluster);
        // filterApi();
      } else {
        setCity(loginBranch);
        //filterApi();
      }
    }
    setLogo(localStorage.getItem("logo"))
  }, [])

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let lastSixMonths = [];
    for (let i = 6; i > 0; i--) {
      const monthIndex = (today.getMonth() - i + 12) % 12;
      const year = monthIndex > today.getMonth() ? currentYear - 1 : currentYear;
      lastSixMonths.push({ name: monthNames[monthIndex], year: year.toString() });
    }

    // Filter months based on selected year
    if (selectedYear) {
      setFilteredMonths(lastSixMonths.filter(m => m.year === selectedYear));
    } else {
      setFilteredMonths(lastSixMonths);
    }
  }, [selectedYear]);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let lastSixMonths = [];
    for (let i = 6; i > 0; i--) {
        const monthIndex = (today.getMonth() - i + 12) % 12;
        const year = monthIndex > today.getMonth() ? currentYear - 1 : currentYear;
        lastSixMonths.push({ name: monthNames[monthIndex], year: year.toString() });
    }

    // Filter months based on selected year
    if (selectedYear) {
        setFilteredMonths(lastSixMonths.filter(m => m.year === selectedYear).map(m => m.name));
    } else {
        setFilteredMonths(lastSixMonths.map(m => m.name));
    }
}, [selectedYear]);


  return (
    <Fragment>
      {/* Sidebar */}

      <div>
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
          <Menu iconShape="square" className="sidemenu">
            <MenuItem
              icon={isCollapsed ? <FaAlignJustify /> : <FaAnglesLeft />}
              onClick={() => toggleSidebar()}
            >
              <img src={logo} alt="Logo" />
            </MenuItem>

            <MenuItem
              className={`menu-item ${isActive("/Dashboard") ? "active-menu-item" : ""}`}
              icon={<FaDashcube />}
              onClick={() => navigate("/Dashboard")}
            >
              {isCollapsed && <span className="tooltip">Dashboard</span>}
              <Link to="/Dashboard">Dashboard</Link>
            </MenuItem>

            <MenuItem
              className={`menu-item ${isActive("/Doc-report") ? "active-menu-item" : ""}`}
              icon={<FaUserMd />}
              onClick={() => navigate("/Doc-report")}
            >
              {isCollapsed && <span className="tooltip">Doc Report</span>}
              <Link to="/Doc-report">Doc Report</Link>
            </MenuItem>

            <MenuItem
              className={`menu-item ${isActive("/Insights") ? "active-menu-item" : ""}`}
              icon={<FaChartBar />}
              onClick={() => navigate("/Insights")}
            >
              {isCollapsed && <span className="tooltip">Insights</span>}
              <Link to="/Insights">Insights</Link>
            </MenuItem>

            {["astrio@gmail.com", "lupin@gmail.com", "care@gmail.com", "mankind@gmail.com"].includes(email) ? (
              <MenuItem
                className={`menu-item ${isActive("/WorkTracker") ? "active-menu-item" : ""}`}
                icon={<GiTimeBomb />}
                onClick={() => navigate("/WorkTracker")}
              >
                {isCollapsed && <span className="tooltip">Work Tracker</span>}
                <Link to="/WorkTracker">Work Tracker</Link>
              </MenuItem>
            ) : (<></>
              // <MenuItem
              //   className={`menu-item ${isActive("/Matrics") ? "active-menu-item" : ""}`}
              //   icon={<MdTableChart />}
              //   onClick={() => navigate("/Matrics")}
              // >
              //   {isCollapsed && <span className="tooltip">Metrics</span>}
              //   <Link to="/Matrics">Metrics</Link>
              // </MenuItem>
            )}
          </Menu>
        </Sidebar>
      </div>

      <div
        className="navigation-bar"
        style={{
          marginLeft:
            windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : "15%",
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

      {/* ============================================MenuStarted ========================================================================*/}

      {/* Page Content */}
      {!props.blockmenu && (
        <div
          style={{
            marginLeft:
              window.innerWidth > 768 ? (isCollapsed ? "8%" : "20%") : "20%",
            //padding: window.innerWidth > 768 ? "10px" : 0,
            transition: "margin-left 0.5s ease",
          }}
        >
          {/* Place your page content here */}

          <div className="sub-nav">
            <div
              className={`filter-contents  ${isNavContentsVisible ? "show" : ""
                }`}
              style={{
                display: props.worktracker ? "none" : "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="filers_sprding">
                <div className="data_list_selection m-1">
                  {props.serach && (
                    <div className="input-group">
                      <select
                        value={getState}
                        onChange={getStateHandeler}
                        //onInputCapture={filterApi}
                        style={{
                          width: "150px",
                          borderRadius: " 10px",
                          padding: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <option value="">Select State...</option>
                        <option value="All">All</option>
                        {getStates &&
                          getStates
                            .filter(item => item !== "#N/A")
                            .sort()
                            .map((item, index) => {
                              if (item != "#N/A")
                                return (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                );
                            })}
                      </select>

                      {/* <button
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
                      </button> */}
                    </div>
                  )}
                </div>

                {console.log("Current Cluster : ", currentCluster)}

                {props.monthhide && (
                  <div className="data_list_selection m-1">
                    <div className="input-group">
                      <select
                        value={getCity}
                        onChange={getCityHandeler}
                        //onInputCapture={cityInsightHandelar}
                        style={{
                          width: "150px",
                          borderRadius: " 10px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <option value="">Select City...</option>
                        <option value="All">All</option>
                        {getCitys &&
                          getCitys
                            .filter(item => item !== "#N/A")
                            .sort()
                            .map((item, index) => {
                              if (item != "#N/A")
                                return (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                );
                            })}
                      </select>
                      {/* <button
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
                      </button> */}
                    </div>
                  </div>
                )}


                {/* Date ------------select */}


                {!props.filterpopover && (
                  <div className="d-flex">
                     {props.monthfilter &&<div
                      className="datepicker d-flex justify-content-end"
                      style={{ display: props.monthfilter ? "block" : "none" }}
                    >
                       <div className="data_list_selection m-1">
                        <div className="input-group">
                        <select onChange={yearHandler} value={selectedYear} style={{ width: "100%", borderRadius: "10px", padding: "4px", border: "1px solid #ccc", outline: "none" }}>
                            <option value="">Select Year</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                          </select>
                        </div>
                      </div>
                    </div>}
                    <div
                      className="datepicker"
                      style={{ display: props.monthfilter ? "block" : "none" }}
                    >
                      <div className="data_list_selection m-1">
                        <div className="input-group">
                        <select value={getMonth} onChange={monthHandelar} style={{ width: "100%", borderRadius: "10px", padding: "4px", border: "1px solid #ccc", outline: "none" }}>
                             <option value="">Select Month</option>
                            {filteredMonths.map((month, index) => (
                              <option key={index} value={month}>{month}</option>
                            ))}
                          </select>

                          {/* <button
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
                    </button> */}
                        </div>
                      </div>
                    </div>



                    <div
                      className="datepicker"
                      style={{ display: props.monthfilter ? "block" : "none" }}
                    >
                      <div className="data_list_selection m-1">
                        <div className="input-group">
                        <select style={{ width: "100%", borderRadius: "10px", padding: "4px", border: "1px solid #ccc", outline: "none" }}>
                        <option value="" style={{ fontWeight: "bold" }}>Select Speciality</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Physician">Physician</option>
                            <option value="Diabetologist">Diabetologist</option>
                            <option value="Surgeon">Surgeon</option>
                          </select>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                )}

                {/* ===============================Button===========================================*/}


                {!props.filterpopover && props.monthfilter && (
                  <div className="data_list_selection m-1">
                    <button
                    
                      onClick={ () => {
                        setInsightsState(getState);
                        setInsightsCity(getCity);
                        setContextMonth(getMonth);
                        setContextCity(getCity)
                        setLocationProfiles(getcountOfProfiles);
                        filterApi();
                      }}
                      style={{
                        borderRadius: " 10px",
                        border: "1px solid #ccc",
                        color: "#ffffff",
                        background: "linear-gradient(90deg, #034ea1 0, #00b7ac 100%)",
                        padding: "5px",
                        outline: "none",
                      }}
                    >
                      Apply
                      {/* <FaSearch className="CircleRightIcon" /> */}
                    </button>
                  </div>
                )}


                {props.filterpopover && (
                  <div>
                    <NewMenuBar></NewMenuBar>
                  </div>
                )}

                {/* <label>Select Doctor:</label>&nbsp; */}


                <div className="data_list_selection m-1">
                        <div className="input-group">
                        <select onChange={specialityHandler} value={selectedSpeciaity} style={{ display:props.filterpopover || props.clusterlogin ? "block" : "none", width: "100%", borderRadius: "10px", padding: "4px", border: "1px solid #ccc", outline: "none" }}>
                            <option value="" style={{ fontWeight: "bold" }}>Select Speciality</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Physician">Physician</option>
                            <option value="Diabetologist">Diabetologist</option>
                            <option value="Surgeon">Surgeon</option>
                          </select>
                        </div>
                      </div>
                <div
                  className="data_list_selection m-1"
                  style={{
                    display:props.filterpopover || props.clusterlogin ? "block" : "none",
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
                   // onClick={bulkExport}
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






            {/* <div className="d-flex">
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
                      
                      {props.monthsCalls?.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
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
              <div
                className="datepicker d-flex justify-content-end"
                style={{ display: props.monthfilter ? "block" : "none" }}
              >
                <div className="data_list_selection m-1">
                  <div className="input-group">
                    <select
                    

                      style={{
                        width: "100%",
                        borderRadius: " 10px 10px 10px 10px",
                        padding: "4px",
                        border: "1px solid #ccc",
                        outline: "none",
                      }}
                    >
                      <option value="">Select Year </option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {props.children}
        </div>
      )}

      <div className="d-flex justify-content-center"></div>
    </Fragment>
  );
}
