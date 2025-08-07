import React, { Fragment, useEffect, useState, useContext, useRef } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { SharedContext } from "../context/SharedContext";
import { FaAlignJustify, FaAnglesLeft, FaDashcube, FaStar, FaUser } from "react-icons/fa6";
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




export default function Navbar(props) {
  const mail = localStorage.getItem("mail");
  const loginBranch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");
  const { isCollapsed, toggleSidebar, drNameContext, specialityContext } = useContext(SidebarContext); // Use the correct context
  const { setDrName } = useContext(SharedContext);
  const { setContextCity, setLocationProfiles, setContextMonth, setContextSpeciality, setContextRating, setContextDepartment } = useContext(SharedContext);
  const { setInsightsState, setInsightsCity, } = useContext(SharedContext);
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
  const [selectedMonths, setSelectedMonths] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [getSpeciality, setAllSpeciality] = useState();
  const [speciality, setSpeciality] = useState();
  const [getAllDepartments, setAllDepartments] = useState();
  const [department, setdepartment] = useState();
  const { profileType, setContextProfileType } = useContext(SidebarContext);
  const { profileCounts, setContextProfileCounts } = useContext(SidebarContext);
  const { sidebarRating, setSidebarRating } = useContext(SidebarContext);
  const [rating, setRating] = useState();
  const location = useLocation();
  const departmentRef = useRef("");



  // New state for MUI sidebar
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openProfileType, setOpenProfileType] = useState(false);
  const [openRatingFilter, setOpenRatingFilter] = useState(false);

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




  console.log("^^^^^^^^^^^^^^^^^------------>" + departmentRef.current)


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

  //   useEffect(() => {
  //   setAllSpeciality(specialityContext)
  // }, [specialityContext]);



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


  useEffect(() => {
    setState("");
    setCity("");
    setMonth("");
    setSpeciality("");
    setSelectedYear("");
    setRating("");
    setSelectedMonths([]);

  }, [profileType]);


  useEffect(() => {
    if (getState) {
    }
    filterApi();
  }, [getState]);

  useEffect(() => {
    if (getCity) {
      //setContextCity(getCity);
      filterApi();
    }
  }, [getCity]);

  useEffect(() => {
    if (speciality) {
      //setContextCity(getCity);
      // setRating("");
      // filterApi();
      setName("");

    }
  }, [speciality]);

  useEffect(() => {
    if (rating) {
      setAllNames("");
      //filterApi();
      setName("");

    }
  }, [rating]);



  //   useEffect(() => {
  //   if (getcountOfProfiles) {
  //     console.log("Updating setLocationProfiles with:", getcountOfProfiles);
  //     setLocationProfiles(getcountOfProfiles);
  //   }
  // }, [getcountOfProfiles]); 

  async function filterApi() {
    // alert(getState)
    let cityToSend = getCity === "All" ? "" : getCity;
    let monthToSend = selectedMonths.length > 0 ? selectedMonths : "";
    const response = await fetch(api + '/getfilterdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "dept": profileType, state: Cluster !== "undefined" ? Cluster : getState, branch: loginBranch !== "undefined" ? loginBranch : cityToSend, month: monthToSend, "speciality": speciality, "rating": sidebarRating })
    });
    const data = await response.json();
    // alert("Hello")
    //console.log("datacountOfProfiles: ",data.result[0].countOfProfiles)
    if (data.result?.length > 0) {
      setAllNames(data.result[0].businessNames);
      if (data.result[0].specialities) {
        setAllSpeciality(data.result[0].specialities);
      }
      if (data.result[0].states) {
        setStates(data.result[0].states)
      }
      if (data.result[0].branches) {
        setCitys(data.result[0].branches)
      }
    } else {
      // setAllNames([]); // Important: Clear the names if nothing returned
      // setAllSpeciality([]); // Clear the speciality if nothing returned
      // setCitys([]); // Clear the citys if nothing returned
    }



    if (data.countOfProfiles && data.countOfProfiles.length > 0) {
      console.log("New countOfProfiles:", data.countOfProfiles);
      setcountOfProfiles([...data.countOfProfiles]); // Ensure new array reference
      setContextProfileCounts([...data.countOfProfiles]);
    }
    //setContextCity(getCity)
    // if(props.serach)
    // {
    //   setContextCity(getCity)
    // }
  }

  //console.log("🔍 getSpeciality state value:", getSpeciality);


  async function fetchAndSetProfiles(dept) {
    let cityToSend = getCity === "All" ? "" : getCity;
    let monthToSend = selectedMonths.length > 0 ? selectedMonths : "";

    const response = await fetch(api + '/getfilterdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dept,
        state: Cluster !== "undefined" ? Cluster : getState,
        branch: loginBranch !== "undefined" ? loginBranch : cityToSend,
        month: monthToSend,
        speciality,
        rating,
      })
    });

    const data = await response.json();

    if (data.countOfProfiles && data.countOfProfiles.length > 0) {
      setcountOfProfiles([...data.countOfProfiles]);
      setLocationProfiles([...data.countOfProfiles]); // ✅ Only update here
    }
  }



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

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let lastSixMonths = [];
    for (let i = 7; i > 0; i--) {
      const monthIndex = (today.getMonth() - i + 12) % 12;
      const year = monthIndex > today.getMonth() ? currentYear - 1 : currentYear;
      lastSixMonths.push({ name: monthNames[monthIndex], year: year.toString() });
    }

    if (selectedYear) {
      setFilteredMonths(lastSixMonths.filter(m => m.year === selectedYear).map(m => `${m.name}`));
    } else {
      setFilteredMonths(lastSixMonths.map(m => `${m.name}`));
    }
  }, [selectedYear]);

  // I have this data I want to create a dashbord with this 
  return (
    <Fragment>
      {/* Modern Sidebar */}
      {/* MUI Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? 80 : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isCollapsed ? 80 : 240,
            boxSizing: 'border-box',

            color: '#C9C7E0',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #7A76A8',
          minHeight: '64px'
        }}>
          {!isCollapsed && (
            <img
              src={logo}
              alt="Logo"
              style={{ height: '40px', maxWidth: '160px' }}
            />
          )}
          <Button
            onClick={toggleSidebar}
            sx={{
              color: '#C9C7E0',
              minWidth: 'auto',
              p: 1
            }}
          >
            {isCollapsed ? <FaAlignJustify size={20} /> : <FaAnglesLeft size={20} />}
          </Button>
        </Box>

        <List sx={{ p: 1 }}>
          {/* Dashboard Menu */}
          <ListItemButton
            onClick={handleDashboardClick}
            component={Link}
            to="/Dashboard"
            sx={{
              borderRadius: '8px',
              mb: 1,
              backgroundColor: isActive("/Dashboard") ? '#7A76A8' : 'transparent',
              '&:hover': {
                backgroundColor: '#808080'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: isActive("/Dashboard") ? 'white' : '#7A76A8' }}>
              <FaDashcube />
            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText primary="Dashboard" />
                {openDashboard ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          <Collapse in={openDashboard && !isCollapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Dashboard Home */}
              {/* <ListItemButton
                component={Link}
                to="/Dashboard"
                sx={{
                  pl: 4,
                  borderRadius: '8px',
                  mb: 1,
                  backgroundColor: isActive("/Dashboard") ? 'rgba(122, 118, 168, 0.5)' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: isActive("/Dashboard") ? 'white' : '#7A76A8' }}>
                  <FaHome />
                </ListItemIcon>
                <ListItemText primary="Dashboard Home" />
              </ListItemButton> */}

              {/* Profile Type Filter */}
              <ListItemButton
                onClick={handleProfileTypeClick}
                sx={{ pl: 4, borderRadius: '8px', mb: 1 }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: '#7A76A8' }}>
                  <FaUser />
                </ListItemIcon>
                <ListItemText primary="Profile Type" />
                {openProfileType ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openProfileType} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 6, pr: 2, pb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#C9C7E0' }}>Select Profile Type</InputLabel>
                    <Select
                      value={department}
                      onChange={(e) => {
                        const value = e.target.value === "All" ? "" : e.target.value;

                        // ✅ Update profile type contexts
                        setContextProfileType(value);
                        setContextDepartment(value);
                        setdepartment(value); // Update local UI select value

                        // ✅ Reset LOCAL states
                        setState("");
                        setCity("");
                        setMonth("");
                        setSpeciality("");
                        setSelectedYear("");
                        setRating("");
                        setSelectedMonths([]);

                        // ✅ Reset CONTEXT values immediately
                        setInsightsState("");
                        setInsightsCity("");
                        setContextMonth([]);
                        setContextCity("");
                        setContextSpeciality("");
                        setContextRating("");

                        // ✅ Update data for selected profile type
                        fetchAndSetProfiles(value);
                      }}

                      label="Select Profile Type"
                      sx={{
                        backgroundColor: '#5D5A85',
                        color: 'white',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7A76A8',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8D89BF',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8D89BF',
                          borderWidth: '1px',
                        },
                        '& .MuiSelect-icon': {
                          color: '#C9C7E0',
                        }
                      }}
                    >
                      <MenuItem value=""><em>Select Profile Type</em></MenuItem>
                      {getAllDepartments &&
                        getAllDepartments
                          .filter(item => item !== "#N/A")
                          .sort()
                          .map((item, index) => (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                          ))
                      }
                      <MenuItem
                        value="All"
                        sx={{ color: '#EF5F80', fontWeight: 'bold' }}
                      >
                        Clear All
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Collapse>

              {/* Rating Filter */}
              <ListItemButton
                onClick={handleRatingFilterClick}
                sx={{ pl: 4, borderRadius: '8px', mb: 1 }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: '#7A76A8' }}>
                  <FaStar />
                </ListItemIcon>
                <ListItemText primary="Rating Filter" />
                {openRatingFilter ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openRatingFilter} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 6, pr: 2, pb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#C9C7E0' }}>Select Rating</InputLabel>
                    <Select
                      value={rating}
                      onChange={(e) => {
                        const value = e.target.value === "All" ? "" : e.target.value;
                        setRating(value); // Update local state
                        setContextRating(value); // Update context
                        setSidebarRating(value); // Update sidebar state
                        filterApi(); // Call filter API with new rating
                      }}
                      label="Select Rating"
                      sx={{
                        backgroundColor: '#5D5A85',
                        color: 'white',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7A76A8',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8D89BF',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8D89BF',
                          borderWidth: '1px',
                        },
                        '& .MuiSelect-icon': {
                          color: '#C9C7E0',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#5D5A85',
                            color: 'white',
                            '& .MuiMenuItem-root': {
                              '&.Mui-selected': {
                                backgroundColor: '#7A76A8',
                              },
                              '&:hover': {
                                backgroundColor: '#CBC3E3',
                              }
                            }
                          }
                        }
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Select Rating</em>;
                        }
                        // Custom display for selected value
                        return selected === "All" ? "Clear All" : `${selected === "1" ? "0-1" :
                          `${Number(selected) - 1}-${selected}`}`;
                      }}
                    >
                      <MenuItem value="" disabled><em>Select Rating</em></MenuItem>
                      <MenuItem value="1">0-1</MenuItem>
                      <MenuItem value="2">1-2</MenuItem>
                      <MenuItem value="3">2-3</MenuItem>
                      <MenuItem value="4">3-4</MenuItem>
                      <MenuItem value="5">4-5</MenuItem>
                      <MenuItem
                        value="All"
                        sx={{ color: '#EF5F80', fontWeight: 'bold' }}
                      >
                        Clear All
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Collapse>
            </List>
          </Collapse>

          {/* Doc Report */}
          <ListItemButton
            component={Link}
            to="/Doc-report"
            sx={{
              borderRadius: '8px',
              mb: 1,
              backgroundColor: isActive("/Doc-report") ? '#7A76A8' : 'transparent',
              '&:hover': {
                backgroundColor: '#CBC3E3'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: isActive("/Doc-report") ? 'white' : '#7A76A8' }}>
              <FaUserMd />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Doc Report" />}
          </ListItemButton>

          {/* Insights */}
          <ListItemButton
            component={Link}
            to="/Insights"
            sx={{
              borderRadius: '8px',
              mb: 1,
              backgroundColor: isActive("/Insights") ? '#7A76A8' : 'transparent',
              '&:hover': {
                backgroundColor: '#CBC3E3'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: isActive("/Insights") ? 'white' : '#7A76A8' }}>
              <FaChartBar />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Insights" />}
          </ListItemButton>

          {/* Work Tracker */}
          {["astrio@gmail.com", "lupin@gmail.com", "care@gmail.com", "mankind@gmail.com"].includes(email) && (
            <ListItemButton
              component={Link}
              to="/WorkTracker"
              sx={{
                borderRadius: '8px',
                mb: 1,
                backgroundColor: isActive("/WorkTracker") ? '#7A76A8' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: isActive("/WorkTracker") ? 'white' : '#7A76A8' }}>
                <GiTimeBomb />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Work Tracker" />}
            </ListItemButton>
          )}
        </List>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <Box sx={{
            p: 2,
            mt: 'auto',
            borderTop: '1px solid #7A76A8',
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {localStorage.getItem("user")}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {email}
            </Typography>
          </Box>
        )}
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
              className="mr-4 text-gray-600 hover:text-[#8D89BF] md:hidden"
            >
              <FaAlignJustify size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#6A6792] hidden md:block">
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
                <div className="w-10 h-10 rounded-full bg-[#8D89BF] flex items-center justify-center text-white">
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
          className="fixed top-16 bg-white shadow-sm z-30 w-full transition-all duration-300"
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
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-48"
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

              {props.filterpopover && (
                <div>
                  <NewMenuBar speciality={speciality} rating={rating} ></NewMenuBar>
                </div>
              )}

              {/* Region Filter */}
              {props.serach && (
                <div className="relative">
                  <select
                    value={getState}
                    onChange={getStateHandeler}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-40"
                  >
                    <option value="">Region</option>
                    {getStates &&
                      getStates
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
              )}

              {/* Unit Filter */}
              {props.monthhide && (
                <div className="relative">
                  <select
                    value={getCity}
                    onChange={getCityHandeler}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-40"
                  >
                    <option value="">Unit</option>
                    {getCitys &&
                      getCitys
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
              )}

              {/* Year Selector */}
              {props.monthfilter && (
                <div className="relative">
                  <select
                    onChange={yearHandler}
                    value={selectedYear}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-32"
                  >
                    <option value="">Year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Month Selector */}
              {props.monthfilter && (
                <div className="relative w-48">
                  <MultiMonthSelector
                    filteredMonths={filteredMonths}
                    selectedMonths={selectedMonths}
                    setSelectedMonths={setSelectedMonths}
                  />
                </div>
              )}

              {/* Speciality Filter */}
              <div className="relative">
                <select
                  value={speciality}
                  onChange={specialityHandler}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-44"
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
              </div>

              {/* Rating Filter */}
              {/* <div className="relative">
                <select
                  value={rating}
                  onChange={ratingHandler}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-32"
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

              {/* Doctor Search */}
              <div className="relative" style={{
                display: props.filterpopover || props.clusterlogin ? "block" : "none",
              }}>
                <div className="flex">
                  <input
                    type="text"
                    list="getDoctor"
                    placeholder="Doctor Name"
                    value={getName}
                    onInputCapture={nameHandelar}
                    className="border border-gray-300 rounded-l-lg py-2 px-3 text-sm focus:border-[#8D89BF] focus:outline-none focus:ring-1 focus:ring-[#8D89BF] w-44"
                  />
                  <button
                    onClick={nameseter}
                    className="bg-[#8D89BF] hover:bg-[#7A76A8] text-white rounded-r-lg px-3 flex items-center transition-colors"
                  >
                    <FaSearch />
                  </button>
                </div>
                <datalist id="getDoctor">
                  {(drNameContext?.length > 0 ? drNameContext : getAllnames)?.map((item, index) => (
                    <option key={index} value={item} />
                  ))}
                </datalist>
              </div>

              {/* Apply Button */}
              {!props.filterpopover && props.monthfilter && (
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
                  className="bg-gradient-to-r from-[#8D89BF] to-[#6A6792] hover:from-[#7A76A8] hover:to-[#5D5A85] text-white py-2 px-6 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}


    </Fragment>
  );
}
//  In the above component I want to replace the existing Sidebar which should have nested submenu of Profile Type and and Rating 
