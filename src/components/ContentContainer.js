import React, { Fragment, useContext, useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import { SidebarContext } from "../SidebarContext";

export default function ContentContainer(props) {
  // Access isCollapsed from SidebarContext
  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // console.log("📦 Props received by ContentContainer:", props);

  return (
    <Fragment>
      <div
        className="content-container-2"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "8%" : "20%") : "20%",
          transition: "margin-left 0.5s ease",
        }}
      >
        {props.data.map((item) => {
          return Object.entries(item).map(([key, value]) => {
            // Skip the "_id" field
            if (key !== "_id") {
              return <CardContainer head={key} val={value} key={key} />;
            }
            return null;
          });
        })}
      </div>
    </Fragment>
  );
}
