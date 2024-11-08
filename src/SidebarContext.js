// SidebarContext.js
import { createContext, useEffect, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1250);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drNameContext, setDrNameContext] = useState([]);

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
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, windowWidth, drNameContext, setDrNameContext }}>
      {children}
    </SidebarContext.Provider>
  );
};
