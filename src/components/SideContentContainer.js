import React, { Fragment, useContext, useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import { SidebarContext } from "../SidebarContext";
import SecondCardContainer from "./SecondCardContainer";

export default function SideContentContainer(props) {
  // Access isCollapsed from SidebarContext
  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);


  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
