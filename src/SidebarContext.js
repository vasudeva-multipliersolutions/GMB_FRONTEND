// SidebarContext.js
import { createContext, useEffect, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1250);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drNameContext, setDrNameContext] = useState([]);
  const [specialityContext, setSpecialityContext] = useState([]);
  const [profileType, setContextProfileType] = useState([]);
  const [profileCounts, setContextProfileCounts] = useState("");
  const [sidebarRating, setSidebarRating] = useState("");
  const [contextState, setContextState] = useState([]);
  const [contextCity, setContextCity] = useState([]);
  const [contextMonth, setContextMonth] = useState([]);
  const [newMonthContext, setNewMonthContext] = useState([]);
  const [doctorAnalysis, setDoctorAnalysis] = useState([]); 
  const [getCitys, setCitys] = useState([]);
  const [populateState, setPopulateState] = useState([]);

  const toggleSidebar = () => {
    if (windowWidth >= 1250) {
      setIsCollapsed(prevState => !prevState);
    } else {
      setIsCollapsed(true); // Always collapse if window width < 1250
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 1250) {
        setIsCollapsed(true); // Automatically collapse on resize if < 1250
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{
      isCollapsed, toggleSidebar, windowWidth, drNameContext, setDrNameContext, specialityContext, setSpecialityContext, profileType, setContextProfileType, profileCounts, setContextProfileCounts, sidebarRating, setSidebarRating, contextState, setContextState,
      contextCity, setContextCity, getCitys, setCitys, contextMonth, setContextMonth, newMonthContext, setNewMonthContext, doctorAnalysis, setDoctorAnalysis, populateState, setPopulateState
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
