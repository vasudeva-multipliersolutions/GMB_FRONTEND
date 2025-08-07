import React, { Fragment } from "react";
import CardContainer from "./CardContainer";

export default function ContentContainer(props) {
  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ">
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