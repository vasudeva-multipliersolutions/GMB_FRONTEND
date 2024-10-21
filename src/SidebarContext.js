// SidebarContext.js
import { createContext, useEffect, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drNameContext, setDrNameContext] = useState([]);

  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

    
  }, []); 
  console.log("Hello"+ drNameContext)

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar,  windowWidth, drNameContext, setDrNameContext}}>
      {children}
    </SidebarContext.Provider>
  );
};
