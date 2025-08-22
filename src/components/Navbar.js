import React, { Fragment, useEffect, useState, useContext, useRef } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { SharedContext } from "../context/SharedContext";
import { FaAlignJustify, FaAnglesLeft, FaChevronDown, FaChevronUp, FaDashcube, FaSquarePhone, FaStar, FaUser, FaUserDoctor } from "react-icons/fa6";
import { FaChartBar, FaHome, FaSearch, FaUserMd } from "react-icons/fa";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { RxCross2 } from "react-icons/rx";
import { GiTimeBomb } from "react-icons/gi";
import { SidebarContext } from "../SidebarContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NewMenuBar } from "./FilterPopover";
import { Bold } from "lucide-react";
import MultiMonthSelector from "./MultiMonthSelector";


// MUI Components for Sidebar
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";




export default function Navbar(props) {
  const mail = localStorage.getItem("mail");
  const loginBranch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");
  const { isCollapsed, toggleSidebar, drNameContext, specialityContext, setSpecialityContext, setDoctorAnalysis, populateState, setPopulateState } = useContext(SidebarContext); // Use the correct context
  const { setDrName } = useContext(SharedContext);
  const { setLocationProfiles, setContextSpeciality, setContextRating, setContextDepartment, } = useContext(SharedContext);
  const { setInsightsState, setInsightsCity, } = useContext(SharedContext);
  const { setNewMonthContext } = useContext(SidebarContext);

  const navigate = useNavigate();
  const [getAllnames, setAllNames] = useState();
  const [getName, setName] = useState();
  const [getState, setState] = useState();
  const [getStates, setStates] = useState();
  const [getCity, setCity] = useState();
  // const [getCitys, setCitys] = useState([]);
  const [getMonth, setMonth] = useState();
  const [getYear, setYear] = useState();
  const api = localStorage.getItem("API");
  const [logo, setLogo] = useState("");
  const [email, setEmai] = useState("");
  const [reload, setReload] = useState();
  const [isNavContentsVisible, setNavContentsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [getcountOfProfiles, setcountOfProfiles] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSpeciaity, setselectedSpeciaity] = useState("");
  const [filteredMonths, setFilteredMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const { contextState, setContextState, contextCity, setContextCity, contextMonth, setContextMonth, getCitys, setCitys } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [getSpeciality, setAllSpeciality] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [getAllDepartments, setAllDepartments] = useState([]);
  const [department, setdepartment] = useState([]);
  const { profileType, setContextProfileType } = useContext(SidebarContext);
  const { profileCounts, setContextProfileCounts } = useContext(SidebarContext);
  const { sidebarRating, setSidebarRating } = useContext(SidebarContext);
  const [specialitySearch, setSpecialitySearch] = useState("");
  const [rating, setRating] = useState([]);
  const location = useLocation();
  const departmentRef = useRef("");



  // New state for MUI sidebar
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openProfileType, setOpenProfileType] = useState(false);
  const [openRatingFilter, setOpenRatingFilter] = useState(false);
  const [openDocReport, setOpenDocReport] = useState(false);
  const [openPhonemetrics, setOpenPhonemetrics] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleDocReportClick = () => {
    setOpenDocReport(!openDocReport);
  };
  const handlePhoneMetricsClick = () => {
    setOpenPhonemetrics(!openPhonemetrics);
  };

  // add at top
  const debounceTimer = useRef(null);

  const triggerFilterApi = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      filterApi();
    }, 200); // wait 200ms for state updates
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUnitOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleDashboardClick = () => {
    // Prevent opening on Insights or Doc-report
    if (location.pathname === "/Insights" || location.pathname === "/Doc-report") {
      return;
    }
    setOpenDashboard(!openDashboard);
  };


  const handleProfileTypeClick = () => {
    setOpenProfileType(!openProfileType);
  };

  const handleRatingFilterClick = () => {
    setOpenRatingFilter(!openRatingFilter);
  };




  useEffect(() => {
    if (location.pathname === "/Insights" || location.pathname === "/Doc-report") {
      setOpenDashboard(false);
    }
  }, [location.pathname]);




  //console.log("^^^^^^^^^^^^^^^^^------------>" + departmentRef.current)


  const isActive = (path) => location.pathname === path;

  function yearHandler(e) {
    const year = e.target.value;
    setSelectedYear(year);
  }

  function specialityHandler(e) {
    const speciality = e.target.value;
    setSpeciality(speciality);
    setRating("");
    if (e.target.value === "All") {
      setSpeciality("");
      setRating("");
    } else {
      setSpeciality(e.target.value)
    }
  }

  function ratingHandler(e) {
    const rating = e.target.value;
    setRating(rating);
    if (e.target.value === "All") {
      setRating("");
    } else {
      setRating(e.target.value)
    }
  }


  // function deptHandler(e) {
  //   const dept = e.target.value;
  //   setdepartment(dept);
  //   setState("");
  //   setCity("");
  //   setMonth("");
  //   setSpeciality("");
  //   setSelectedYear("");
  //   setRating("");
  //   setSelectedMonths([]);
  //   console.log("Department selected: ", dept);
  //   console.log("-------------: ", department);
  //   if (e.target.value === "All") {
  //     setdepartment("");
  //     setState("");
  //     setCity("");
  //     setMonth("");
  //     setSpeciality("");
  //     setSelectedYear("");
  //     setRating("");
  //     setSelectedMonths([]);
  //   } else {
  //     setdepartment(e.target.value)
  //   }
  // }


  //   function deptHandler(e) {
  //   const dept = e.target.value;
  //   setdepartment(dept);
  //   setContextDepartment(dept === "All" ? "" : dept);
  //   setState("");
  //   setCity("");
  //   setMonth("");
  //   setSpeciality("");
  //   setSelectedYear("");
  //   setRating("");
  //   setSelectedMonths([]);
  //   filterApi();

  //   if (dept === "All") {
  //     setdepartment("");
  //   } else {
  //     setdepartment(dept);
  //   }
  // }


  function deptHandler(e) {
    const dept = e.target.value;
    const resolvedDept = dept === "All" ? "" : dept;

    setContextProfileType(resolvedDept);
    // ✅ Then apply new department & ref
    setdepartment(dept);
    departmentRef.current = resolvedDept;
    setContextDepartment(profileType);
  }




  // useEffect(() => {
  //   filterApi();
  // }, [speciality]);
  //console.log("Speciality24567: ", selectedSpeciaity);


  useEffect(() => {
    setAllSpeciality(specialityContext)
  }, [specialityContext]);

  // useEffect(() => {
  //   setCitys(contextState)
  // }, [contextState]);





  // useEffect(() => {
  //   const monthNames = [
  //     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //   ];


  //   if (!selectedYear) {
  //     setFilteredMonths(monthNames.map(m => `${m}-2024`).concat(monthNames.map(m => `${m}-2025`)));
  //   } else {
  //     setFilteredMonths(monthNames.map(m => `${m}-${selectedYear}`));
  //   }
  // }, [selectedYear]);

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

  function nameHandelar(e) {
    setName(e.target.value)
  }
  function nameseter() {
    setDrName(getName)
  }
  async function getStateHandeler(e) {
    setCity("")
    setMonth("");
    setSpeciality("");
    setSelectedYear("");
    setRating("");
    setSelectedMonths([]);
    if (e.target.value === "All") {
      //window.location.reload();
      setState("");
      setSpeciality("");
      setSelectedYear("");
      setCity("")
      setMonth("");
      setRating("");
      // filterApi();

    } else {
      setState(e.target.value)
    }
    //filterApi()
  }
  function getCityHandeler(e) {
    setMonth("");
    setSpeciality("");
    setSelectedMonths([]);
    setSelectedYear("");
    setRating("");
    setCity(e.target.value)
    if (e.target.value === "All") {
      setSpeciality("");
      setSelectedYear("");
      setCity("")
      setMonth("");
      setRating("");
    } else {
      setCity(e.target.value)
    }
  }
  function monthHandelar(e) {
    setSpeciality("");
    setMonth(e.target.value)
  }

  useEffect(() => {
    if (selectedMonths) {
      setSpeciality("");
      filterApi();
    }
  }, [selectedMonths]);


  // useEffect(() => {
  //   setState("");
  //   setCity("");
  //   setMonth("");
  //   setSpeciality("");
  //   setSelectedYear("");
  //   setRating("");
  //   setSelectedMonths([]);

  // }, [profileType]);


  // useEffect(() => {
  //   if (getState) {
  //   }
  //   filterApi();
  // }, [getState]);

  // useEffect(() => {
  //   if (getCity) {
  //     //setContextCity(getCity);
  //     filterApi();
  //   }
  // }, [getCity]);

  // useEffect(() => {
  //   if (speciality) {
  //     //setContextCity(getCity);
  //     // setRating("");
  //     // filterApi();
  //     setName("");

  //   }
  // }, [speciality]);

  // useEffect(() => {
  //   if (rating) {
  //     setAllNames("");
  //     //filterApi();
  //     setName("");

  //   }
  // }, [rating]);



  //   useEffect(() => {
  //   if (getcountOfProfiles) {
  //     console.log("Updating setLocationProfiles with:", getcountOfProfiles);
  //     setLocationProfiles(getcountOfProfiles);
  //   }
  // }, [getcountOfProfiles]); 

  // async function filterApi() {
  //   let stateToSend = contextState?.length ? contextState : [];
  //   let cityToSend = contextCity?.length ? contextCity : [];
  //   let monthToSend = contextMonth?.length ? contextMonth : [];

  //   const response = await fetch(api + '/getfilterdata', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       dept: department,
  //       state: stateToSend,
  //       branch: cityToSend,
  //       month: monthToSend,
  //       speciality,
  //       rating
  //     }),
  //   });

  //   const data = await response.json();

  //   if (data.result?.length > 0) {
  //     const result = data.result[0];

  //     // ✅ always update with defaults
  //     setAllNames(result.businessNames || []);
  //     setAllSpeciality(result.specialities || []);
  //     // console.log("🔍 All Names:-------------------------------------------", result.branches);
  //     setCitys(result.branches || []);
  //   } else {
  //     // ✅ clear everything when result empty
  //     // setAllNames([]);
  //     // setAllSpeciality([]);
  //     //setCitys([]);
  //   }

  //   if (data.countOfProfiles?.length > 0) {
  //     setcountOfProfiles([...data.countOfProfiles]);
  //     setLocationProfiles([...data.countOfProfiles]); // ✅ Only update here
  //     setContextProfileCounts([...data.countOfProfiles]);
  //   } else {
  //     setcountOfProfiles([]);
  //     setContextProfileCounts([]);
  //   }
  // }


  async function filterApi() {
    let stateToSend = contextState?.length ? contextState : [];
    let cityToSend = contextCity?.length ? contextCity : [];
    let monthToSend = contextMonth?.length ? contextMonth : [];

    const response = await fetch(api + '/getfilterdata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dept: profileType,
        state: stateToSend,
        branch: cityToSend,
        month: monthToSend,
        speciality,
        rating
      }),
    });

    const data = await response.json();

    if (data.result?.length > 0) {
      const result = data.result[0];

      // ✅ update only if non-empty
      if (result.businessNames?.length > 0) {
        setAllNames(result.businessNames);
      }
      if (result.specialities?.length > 0) {
        setAllSpeciality(result.specialities);
      }
      if (result.branches?.length > 0) {
        setCitys(result.branches);
      }
    }
    if (data?.doctorAnalysis) {
      setDoctorAnalysis(data.doctorAnalysis); // ✅ store globally
    }
    if (data?.statePopulate?.length > 0) {
      setPopulateState(data.statePopulate[0].states || []);
    } else {
      setPopulateState([]); // Clear if no data found
    }


    if (data.countOfProfiles?.length > 0) {
      setcountOfProfiles([...data.countOfProfiles]);
      setLocationProfiles([...data.countOfProfiles]);
      setContextProfileCounts([...data.countOfProfiles]);
    } else {
      setcountOfProfiles([]);
      setContextProfileCounts([]);
    }
  }


  // useEffect(() => {
  //   if (contextCity.length >= 0) {
  //     filterApi();
  //   }
  // }, [contextCity]);



  console.log("🔍 getCitys state value:", populateState);


  // async function fetchAndSetProfiles(dept) {
  //   let cityToSend = getCity === "All" ? "" : getCity;
  //   let monthToSend = selectedMonths.length > 0 ? selectedMonths : "";

  //   const response = await fetch(api + '/getfilterdata', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       dept,
  //       state: Cluster !== "undefined" ? Cluster : getState,
  //       branch: loginBranch !== "undefined" ? loginBranch : cityToSend,
  //       month: monthToSend,
  //       speciality,
  //       rating,
  //     })
  //   });

  //   const data = await response.json();

  //   if (data.countOfProfiles && data.countOfProfiles.length > 0) {
  //     setcountOfProfiles([...data.countOfProfiles]);
  //     setLocationProfiles([...data.countOfProfiles]); // ✅ Only update here
  //   }
  // }



  useEffect(() => {
    async function getAllDoctrosNames() {
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
    async function getallLoc() {
      const locDetails = await fetch(api + '/getunquelocdata', {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const getlocdetails = await locDetails.json()
      setStates(getlocdetails[0].states)
      setCitys(getlocdetails[0].branches)
    }
    async function getAllSpeciality() {
      try {
        const response = await fetch(api + '/getallspeciality', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Check if you have Specialities and Departments
        // console.log("Specialities:", data.Specialities);
        //console.log("Departments:", data.Departments);

        // Assuming you want to save both in state
        setAllSpeciality(data.Specialities); // or whatever state you're using
        setAllDepartments(data.Departments); // if you have another state

      } catch (error) {
        console.error("Error fetching specialities:", error.message);
      }
    }




    if (mail === "manipal@gmail.com") {
      getallLoc()
      getAllDoctrosNames()
    } else {
      if (loginBranch === "undefined") {
        setState(Cluster);
        // filterApi();
      } else {
        setCity(loginBranch);
        // filterApi();
      }
    }
    setLogo(localStorage.getItem("logo"))
    getAllSpeciality()
  }, [])

  // useEffect(() => {
  //   const today = new Date();
  //   const currentYear = today.getFullYear();
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   let lastSixMonths = [];
  //   for (let i = 6; i > 0; i--) {
  //     const monthIndex = (today.getMonth() - i + 12) % 12;
  //     const year = monthIndex > today.getMonth() ? currentYear - 1 : currentYear;
  //     lastSixMonths.push({ name: monthNames[monthIndex], year: year.toString() });
  //   }

  //   // Filter months based on selected year
  //   if (selectedYear) {
  //     setFilteredMonths(lastSixMonths.filter(m => m.year === selectedYear));
  //   } else {
  //     setFilteredMonths(lastSixMonths);
  //   }
  // }, [selectedYear]);

  // useEffect(() => {
  //   const today = new Date();
  //   const currentYear = today.getFullYear();
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   let lastSixMonths = [];
  //   for (let i = 7; i > 0; i--) {
  //     const monthIndex = (today.getMonth() - i + 12) % 12;
  //     const year = monthIndex > today.getMonth() ? currentYear - 1 : currentYear;
  //     lastSixMonths.push({ name: monthNames[monthIndex], year: year.toString() });
  //   }

  //   if (selectedYear) {
  //     setFilteredMonths(lastSixMonths.filter(m => m.year === selectedYear).map(m => `${m.name}`));
  //   } else {
  //     setFilteredMonths(lastSixMonths.map(m => `${m.name}`));
  //   }
  // }, [selectedYear]);

  useEffect(() => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const today = new Date();

    // helper -> last 7 months including current, only month names
    const lastSevenMonths = () => {
      const arr = [];
      for (let i = 7; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        arr.push(monthNames[d.getMonth()]); // ✅ only "Mon"
      }
      return arr;
    };

    if (!selectedYear) {
      // default: last 7 month labels
      setFilteredMonths(lastSevenMonths());
    } else {
      // when a year is chosen: all 12 months of that year (still only names)
      setFilteredMonths(monthNames.map(m => `${m}`));
    }
  }, [selectedYear]);




  // useEffect(() => {
  //   if (speciality.length >= 0) {
  //     filterApi();
  //   }
  // }, [speciality]);

  // useEffect(() => {
  //   if (rating.length >= 0) {
  //     filterApi();
  //   }
  // }, [rating]);

  // useEffect(() => {
  //   if (department.length >= 0) {
  //     filterApi();
  //   }
  // }, [department]);

  // useEffect(() => {
  //   if (contextState.length >= 0) {
  //     filterApi();
  //   }
  // }, [contextState]);

  // useEffect(() => {
  //   if (contextCity.length >= 0) {
  //     filterApi();
  //   }
  // }, [contextCity]);

  useEffect(() => {
    triggerFilterApi();
  }, [speciality, rating, profileType, contextState, contextCity, selectedMonths]);



  return (
    <Fragment>
      {/* Modern Sidebar */}
      {/* MUI Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? 80 : 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 80 : 260,
            boxSizing: "border-box",
            color: "#000",
            backgroundColor: "#FFF",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        {/* Top Bar inside Sidebar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #ccc",
            minHeight: "64px",
          }}
        >
          {!isCollapsed && (
            <img src={logo} alt="Logo" style={{ height: "40px", maxWidth: "160px" }} />
          )}
          <ListItemButton
            onClick={toggleSidebar}
            sx={{
              color: "#000",
              minWidth: "auto",
              p: 1,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            {isCollapsed ? <FaAlignJustify size={20} /> : <FaAnglesLeft size={20} />}
          </ListItemButton>
        </Box>

        <List sx={{ p: 1 }}>
          {/* Dashboard Button */}
          <ListItemButton
            onClick={() => {
              handleDashboardClick();
              navigate("/Dashboard");
            }}
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Dashboard") ? "#1976d2" : "transparent",
              color: isActive("/Dashboard") ? "#fff" : "#4a4a4a",
              "&:hover": {
                backgroundColor: isActive("/Dashboard") ? "#1565c0" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Dashboard") ? "#fff" : "#000",
              }}
            >
              <FaDashcube />
            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem", fontFamily: "Poppins" }} />
                {openDashboard ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          {/* Nested Filters */}
          <Collapse in={openDashboard && !isCollapsed} timeout="auto" unmountOnExit>
            {/* Profile Type */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Profile Type
              </FormLabel>

              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {getAllDepartments &&
                  getAllDepartments
                    .filter((dep) => dep !== "#N/A")
                    .sort()
                    .map((dep, index) => (
                      <label
                        key={index}
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={department.includes(dep)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...department, dep]
                              : department.filter((val) => val !== dep);

                            setdepartment(newSelection);
                            setContextProfileType(newSelection);
                            setContextDepartment(newSelection);


                            // ✅ trigger filter with latest selections
                            // filterApi();
                          }}

                        />
                        {dep}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setdepartment([]);
                    setContextProfileType([]);
                    setContextDepartment([]);
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>


            {/* Rating */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Rating
              </FormLabel>
              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {["1", "2", "3", "4", "5"].map((val) => (
                  <label key={val} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={rating.includes(val)}
                      onChange={(e) => {
                        let newSelection = e.target.checked
                          ? [...rating, val]
                          : rating.filter((r) => r !== val);
                        setRating(newSelection);
                        setContextRating(newSelection);
                        setSidebarRating(newSelection);

                        // ✅ instant apply
                        // filterApi();
                      }}
                    />
                    {val === "1" ? "0-1" : `${Number(val) - 1}-${val}`}
                  </label>
                ))}

                <button
                  onClick={() => {
                    setRating([]);
                    setContextRating([]);
                    setSidebarRating([]);
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>

            {/* Specialty */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Specialty
              </FormLabel>

              <input
                type="text"
                placeholder="Search"
                value={specialitySearch}
                onChange={(e) => setSpecialitySearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "4px 8px",
                  fontSize: "14px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {getSpeciality &&
                  getSpeciality
                    .filter((sp) =>
                      sp !== "#N/A" &&
                      sp.toLowerCase().includes(specialitySearch.toLowerCase())
                    )
                    .sort()
                    .slice(0, 5)
                    .map((sp, index) => (
                      <label key={index} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={speciality.includes(sp)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...speciality, sp]
                              : speciality.filter((s) => s !== sp);

                            setSpeciality(newSelection);
                            setContextSpeciality(newSelection);
                            setSpecialityContext(newSelection);

                            // ✅ instant apply
                            // filterApi();
                          }}
                        />
                        {sp}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setSpeciality([]);
                    setContextSpeciality([]);
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>

          </Collapse>


          {/* Other Menu Items */}
          {/* Doc Reports */}
          {/* <ListItemButton
            component={Link}
            to="/Doc-report"
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Doc-report") ? "#1976d2" : "transparent",
              color: isActive("/Doc-report") ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: isActive("/Doc-report") ? "#1565c0" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Doc-report") ? "#fff" : "#000",
              }}
            >
              <FaUserMd />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Doc Reports"
                primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem" }}
              />
            )}
          </ListItemButton>
           */}

          <ListItemButton
            onClick={() => {
              handleDocReportClick();   // 👈 use new handler
              navigate("/Doc-report");
            }}
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Doc-report") ? "#1976d2" : "transparent",
              color: isActive("/Doc-report") ? "#fff" : "#4a4a4a",
              "&:hover": {
                backgroundColor: isActive("/Doc-report") ? "#1565c0" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Doc-report") ? "#fff" : "#000",
              }}
            >
              <FaUserDoctor />

            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText primary="Profile Report" primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem", fontFamily: "Poppins", }} />
                {openDocReport ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>


          {/* Nested Filters */}
          <Collapse in={openDocReport && !isCollapsed} timeout="auto" unmountOnExit>
            {/* Profile Type */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Profile Type
              </FormLabel>

              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {getAllDepartments &&
                  getAllDepartments
                    .filter((dep) => dep !== "#N/A")
                    .sort()
                    .map((dep, index) => (
                      <label
                        key={index}
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={department.includes(dep)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...department, dep]
                              : department.filter((val) => val !== dep);

                            setdepartment(newSelection);
                            setContextProfileType(newSelection);

                            // ✅ trigger filter with latest selections
                            // filterApi();
                          }}
                        />
                        {dep}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setdepartment([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextProfileType([]);
                      setContextDepartment([]);
                    }
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>


            {/* Rating */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Rating
              </FormLabel>
              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {["1", "2", "3", "4", "5"].map((val) => (
                  <label key={val} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={rating.includes(val)}
                      onChange={(e) => {
                        let newSelection = e.target.checked
                          ? [...rating, val]
                          : rating.filter((r) => r !== val);
                        setRating(newSelection);
                        if (window.location.pathname === "/Dashboard") {
                          setContextRating(newSelection);
                          setSidebarRating(newSelection);
                        }

                        // ✅ instant apply
                        // filterApi();
                      }}
                    />
                    {val === "1" ? "0-1" : `${Number(val) - 1}-${val}`}
                  </label>
                ))}

                <button
                  onClick={() => {
                    setRating([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextRating([]);
                    }
                    setSidebarRating([]);
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>

            {/* Specialty */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Specialty
              </FormLabel>

              <input
                type="text"
                placeholder="Search"
                value={specialitySearch}
                onChange={(e) => setSpecialitySearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "4px 8px",
                  fontSize: "14px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {getSpeciality &&
                  getSpeciality
                    .filter((sp) =>
                      sp !== "#N/A" &&
                      sp.toLowerCase().includes(specialitySearch.toLowerCase())
                    )
                    .sort()
                    .slice(0, 5)
                    .map((sp, index) => (
                      <label key={index} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={speciality.includes(sp)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...speciality, sp]
                              : speciality.filter((s) => s !== sp);

                            setSpeciality(newSelection);
                            if (window.location.pathname === "/Dashboard") {
                              setContextSpeciality(newSelection);
                            }

                            // ✅ instant apply
                            // filterApi();
                          }}
                        />
                        {sp}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setSpeciality([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextSpeciality([]);
                    }
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>

          </Collapse>

          {/* Phone Update */}
          <ListItemButton
            onClick={() => {
              handlePhoneMetricsClick();   // 👈 use new handler
              navigate("/Phone-Metrics");
            }}
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Phone-Metrics") ? "#1976d2" : "transparent",
              color: isActive("/Phone-Metrics") ? "#fff" : "#4a4a4a",
              "&:hover": {
                backgroundColor: isActive("/Phone-Metrics") ? "#1565c0" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Phone-Metrics") ? "#fff" : "#000",
              }}
            >
              <FaSquarePhone />
            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText primary="Phone Number Update" primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem", fontFamily: "Poppins", }} />
                {openPhonemetrics ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>


          {/* Nested Filters */}
          <Collapse in={openPhonemetrics && !isCollapsed} timeout="auto" unmountOnExit>
            {/* Profile Type */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Profile Type
              </FormLabel>

              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {getAllDepartments &&
                  getAllDepartments
                    .filter((dep) => dep !== "#N/A")
                    .sort()
                    .map((dep, index) => (
                      <label
                        key={index}
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={department.includes(dep)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...department, dep]
                              : department.filter((val) => val !== dep);

                            setdepartment(newSelection);
                            setContextProfileType(newSelection);
                            setContextDepartment(newSelection);

                            // ✅ trigger filter with latest selections
                            // filterApi();
                          }}
                        />
                        {dep}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setdepartment([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextProfileType([]);
                      setContextDepartment([]);
                    }
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>


            {/* Rating */}
            {/* <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Rating
              </FormLabel>
              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                {["1", "2", "3", "4", "5"].map((val) => (
                  <label key={val} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={rating.includes(val)}
                      onChange={(e) => {
                        let newSelection = e.target.checked
                          ? [...rating, val]
                          : rating.filter((r) => r !== val);
                        setRating(newSelection);
                        if (window.location.pathname === "/Dashboard") {
                          setContextRating(newSelection);
                          setSidebarRating(newSelection);
                        }

                        // ✅ instant apply
                        // filterApi();
                      }}
                    />
                    {val === "1" ? "0-1" : `${Number(val) - 1}-${val}`}
                  </label>
                ))}

                <button
                  onClick={() => {
                    setRating([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextRating([]);
                    }
                    setSidebarRating([]);
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box> */}

            {/* Specialty */}
            <Box sx={{ px: 2, py: 1 }}>
              <FormLabel sx={{ color: "#000", fontWeight: 600, fontSize: "0.9rem" }}>
                Specialty
              </FormLabel>

              <input
                type="text"
                placeholder="Search"
                value={specialitySearch}
                onChange={(e) => setSpecialitySearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "4px 8px",
                  fontSize: "14px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {getSpeciality &&
                  getSpeciality
                    .filter((sp) =>
                      sp !== "#N/A" &&
                      sp.toLowerCase().includes(specialitySearch.toLowerCase())
                    )
                    .sort()
                    .slice(0, 5)
                    .map((sp, index) => (
                      <label key={index} style={{ color: "#000", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={speciality.includes(sp)}
                          onChange={(e) => {
                            let newSelection = e.target.checked
                              ? [...speciality, sp]
                              : speciality.filter((s) => s !== sp);

                            setSpeciality(newSelection);
                            setContextSpeciality(newSelection);


                            // ✅ instant apply
                            // filterApi();
                          }}
                        />
                        {sp}
                      </label>
                    ))}

                <button
                  onClick={() => {
                    setSpeciality([]);
                    if (window.location.pathname === "/Dashboard") {
                      setContextSpeciality([]);
                    }
                    filterApi();
                  }}
                  style={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Clear All
                </button>
              </Box>
            </Box>

          </Collapse>





          {/* Phone Update */}

          {/* <ListItemButton
            component={Link}
            to="/Phone-Metrics"
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Phone-Metrics") ? "#1976d2" : "transparent",
              color: isActive("/Phone-Metrics") ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: isActive("/Phone-Metrics") ? "#1565c0" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Phone-Metrics") ? "#fff" : "#000",
              }}
            >
              <FaUser />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Phone number update"
                primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem" }}
              />
            )}
          </ListItemButton> */}

          {/* Insights */}
          <ListItemButton
            component={Link}
            to="/Insights"
            sx={{
              borderRadius: "8px",
              mb: 1,
              backgroundColor: isActive("/Insights") ? "#1976d2" : "transparent",
              color: isActive("/Insights") ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: isActive("/Insights") ? "#1565c0" : "#4a4a4a",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: isActive("/Insights") ? "#fff" : "#000",
              }}
            >
              <FaChartBar />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Insights"
                primaryTypographyProps={{ fontWeight: "400", fontSize: "0.9rem", fontFamily: "Poppins", }}
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>






      {/* Modern Top Navigation Bar */}
      <div
        className="fixed top-0 right-0 left-0 bg-white shadow-md z-40 h-16 flex items-center px-6 transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? "5rem" : "16rem",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => setNavContentsVisible(!isNavContentsVisible)}
              className="mr-4 text-gray-600 hover:text-[#1565C0] md:hidden"
            >
              <FaAlignJustify size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#1565C0] hidden md:block">
              Google My Business Performance
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                aria-describedby={id}
                onClick={handleClick}
                className="rounded-full bg-[#F0EFFF] hover:bg-[#E5E3FF] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center text-white">
                  {localStorage.getItem("user")?.charAt(0) || "U"}
                </div>
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
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div className="p-4">
                  <div className="mb-3">
                    <p className="font-semibold">{localStorage.getItem("user")}</p>
                    <p className="text-sm text-gray-600">{email}</p>
                  </div>
                  <button
                    onClick={logoutHandeler}
                    className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-md flex items-center justify-center"
                  >
                    Logout
                  </button>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Bar */}
      {!props.blockmenu && (
        <div
          className="bg-white shadow-sm z-30  transition-all duration-300 mt-16"
          style={{
            marginLeft: isCollapsed ? "5rem" : "16rem",
            display: isNavContentsVisible ? "block" : "none",
          }}
        >
          <div className="px-6 py-4 border-b">
            <div className={`flex flex-wrap gap-3 items-center ${props.worktracker ? "hidden" : ""}`}>
              {/* Department Filter */}
              {/* {props.serach && (
                <div className="relative">
                  <select
                    value={department}
                    onChange={deptHandler}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0] w-48"
                  >
                    <option value="">Profile Type</option>
                    {getAllDepartments &&
                      getAllDepartments
                        .filter(item => item !== "#N/A")
                        .sort()
                        .map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    <option value="All" className="text-red-500">
                      Clear All
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )} */}

              {/* {props.filterpopover && (
                <div>
                  <NewMenuBar speciality={speciality} rating={rating} ></NewMenuBar>
                </div>
              )} */}

              {/* Filters Section */}
              <div className="flex flex-col gap-6  w-screen px-4">


                {/* Filters Row */}
                <div className="flex flex-wrap gap-6 mt-2 w-full ">
                  {/* Region Filter */}
                  <div className="flex flex-col flex-1 min-w-[300px]">
                    <label className="font-normal text-[0.9rem] text-gray-700 mb-1">Region</label>
                    <div className="flex flex-wrap gap-4">
                      {getStates?.filter((s) => s !== "#N/A").sort().map((region) => {
                        const selectedStates =
                          Array.isArray(populateState) && populateState.length > 0
                            ? populateState
                            : Array.isArray(contextState)
                              ? contextState
                              : [];

                        const isChecked = selectedStates.includes(region);

                        return (
                          <label
                            key={region}
                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...selectedStates, region]
                                  : selectedStates.filter((r) => r !== region);

                                setContextState(next);
                                setPopulateState(next);

                                if (window.location.pathname === "/Dashboard") {
                                  setInsightsState(next);
                                  setInsightsCity(contextCity);
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            {region}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Unit Filter */}
                  <div className="flex flex-col flex-1 min-w-[260px] relative" ref={dropdownRef}>
                    <label className="font-normal text-[0.9rem] text-gray-700 mb-1">Unit</label>

                    {/* Dropdown Box */}
                    <div
                      className="border border-gray-300 rounded-md px-2 py-2 cursor-pointer flex justify-between items-center bg-white"
                      onClick={() => setUnitOpen((prev) => !prev)}
                    >
                      <div className="flex flex-wrap gap-1 max-h-[70px] overflow-y-auto">
                        {Array.isArray(contextCity) && contextCity.length > 0 ? (
                          contextCity.map((unit) => (
                            <span
                              key={unit}
                              className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm flex items-center"
                            >
                              {unit}
                              <button
                                className="ml-1 text-xs font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextCity((prev) =>
                                    Array.isArray(prev)
                                      ? prev.filter((u) => u !== unit)
                                      : []
                                  );
                                  filterApi();
                                }}
                              >
                                ✕
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="font-normal text-[0.9rem] text-gray-700">
                            Select units...
                          </span>
                        )}
                      </div>
                      <span className="ml-2 font-normal text-[0.9rem] text-gray-700">
                        {unitOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>

                    {/* Dropdown Menu */}
                    {unitOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto border border-gray-300 bg-white shadow-lg rounded-md z-10">
                        {getCitys
                          ?.filter(
                            (u) =>
                              u !== "#N/A" &&
                              !(Array.isArray(getStates) ? getStates.includes(u) : false)
                          )
                          .sort()
                          .map((unit) => {
                            const selectedUnits = Array.isArray(contextCity)
                              ? contextCity
                              : [];
                            const isSelected = selectedUnits.includes(unit);

                            return (
                              <label
                                key={unit}
                                className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer font-normal text-[0.9rem] text-gray-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    const next = isSelected
                                      ? selectedUnits.filter((u) => u !== unit)
                                      : [...selectedUnits, unit];
                                    setContextCity(next);
                                  }}
                                  className="mr-2"
                                />
                                <span className="truncate">{unit}</span>
                              </label>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>





                {/* Year + Month + Apply grouped */}
                <div className="flex items-end gap-4">
                  {/* Year Selector */}
                  <div className="flex flex-col w-96">
                    <label className="font-normal text-[0.9rem] text-gray-700 mb-1 block">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setSelectedMonths([]);   // ✅ reset months on year change
                        setContextMonth([]);
                      }}
                      className="font-normal text-[0.9rem] border text-gray-700 border-gray-300 rounded-md px-3 py-2 w-full"
                    >
                      <option value="">Select Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>

                  {/* Month Selector */}
                  <div className="flex flex-col w-[800px]">
                    <label className="font-normal text-[0.9rem] text-gray-700 mb-1">Month</label>
                    <MultiMonthSelector
                      filteredMonths={filteredMonths}
                      selectedMonths={selectedMonths}
                      setSelectedMonths={(vals) => {
                        setSelectedMonths(vals);
                        setNewMonthContext(vals); // ✅ store month context
                        setContextMonth(vals); // ✅ update context month
                      }}
                    />
                  </div>

                  {/*   */}

                  {/* Doctor Search */}
                  <div
                    className="relative"
                    style={{
                      display: props.filterpopover || props.clusterlogin ? "block" : "none",
                    }}
                  >
                    <div className="flex ml-2 flex-col w-48">
                      {/* ✅ Label above input bar */}
                      <label className="font-normal text-[0.9rem] text-gray-700 mb-1 block">
                        Profile Search
                      </label>

                      {/* ✅ Input + button grouped */}
                      <div className="flex">
                        <input
                          type="text"
                          list="doctorList"
                          placeholder="Enter profile name"
                          value={getName}
                          onChange={nameHandelar}   // ✅ use onChange (better than onInputCapture for React forms)
                          className="border border-gray-300 rounded-l-md py-[10px] px-3 text-sm text-[0.9rem] 
                    focus:outline-none f
                    w-full"
                        />
                        <button
                          type="button"
                          onClick={nameseter}
                          className="bg-[#1565C0] hover:bg-[#7A76A8] text-white 
                   rounded-r-md px-3 flex items-center transition-colors"
                        >
                          <FaSearch />
                        </button>
                      </div>

                      {/* ✅ Proper datalist (linked to input via list attr) */}
                      <datalist id="doctorList">
                        {(drNameContext?.length > 0 ? drNameContext : getAllnames)?.map(
                          (item, index) => (
                            <option key={index} value={item} />
                          )
                        )}
                      </datalist>
                    </div>
                  </div>

                  {/* Clear All Filters at bottom right */}
                  <div className="flex justify-end mt-4 w-full">
                    <button
                      onClick={() => {
                        setSelectedYear("");
                        setSelectedMonths([]);
                        setNewMonthContext([]);
                        setContextMonth([]);
                        setContextState([]);
                        setContextCity([]);
                        filterApi();
                      }}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-md text-sm font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>

              </div>





              {/* Speciality Filter */}
              {/* <div className="relative">
                <select
                  value={speciality}
                  onChange={specialityHandler}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0] w-44"
                >
                  <option value="">Speciality</option>
                  {getSpeciality &&
                    getSpeciality
                      .filter(item => item !== "#N/A")
                      .sort()
                      .map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  <option value="All" className="text-red-500">
                    Clear All
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div> */}

              {/* Rating Filter */}
              {/* <div className="relative">
                <select
                  value={rating}
                  onChange={ratingHandler}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#1565C0] focus:outline-none focus:ring-1 focus:ring-[#1565C0] w-32"
                >
                  <option value="">Rating</option>
                  <option value="1">0-1</option>
                  <option value="2">1-2</option>
                  <option value="3">2-3</option>
                  <option value="4">3-4</option>
                  <option value="5">4-5</option>
                  <option value="All" className="text-red-500">
                    Clear All
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div> */}





              {/* Apply Button */}
              {/* {!props.filterpopover && props.monthfilter && (
                <button
                  onClick={() => {
                    setInsightsState(getState);
                    setInsightsCity(getCity);
                    setContextMonth(selectedMonths);
                    setContextCity(getCity);
                    setContextSpeciality(speciality);
                    // setContextRating(rating);
                    setLocationProfiles(getcountOfProfiles);
                    filterApi();
                  }}
                  className="bg-gradient-to-r from-[#1565C0] to-[#6A6792] hover:from-[#7A76A8] hover:to-[#5D5A85] text-white py-2 px-6 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}


    </Fragment>
  );
}
//  Here while I am selecting anything in Profile Type, Rating, Specialty after selecting Region, Unit, Month, the selected values of Region, Unit, Month are not going in the payload I wnat whenever I select Profile Type, Rating, Specialty the selected values of Region, Unit, Month should also go in the payload also Insted if apply button I want to achivethe same functionality in change of options. also reduce th size of Unit because of too many units it is exceeding the width of the screen
