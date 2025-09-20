import React from "react";
import CountUp from "react-countup";
import { Tooltip, Skeleton } from "@mui/material";

const descMap = {
  "Average Rating": "The overall average rating from all reviews.",
  "Total Reviews": "The total number of reviews received.",
};

const logoMap = {
  "Average Rating": "bi-star-fill text-yellow-500",
  "Total Reviews": "bi-chat-left-text text-blue-500",
};

export default function ReviewRating(props) {
  // If you want to show a skeleton while loading, add a loading prop or state as needed
  const loading = false;

  // Card rendering helper
  const renderCard = (head, value) => {
    const tooltipContent = (
      <div className="flex items-center gap-2">
        <i className={`bi ${logoMap[head]} text-lg`} />
        <span>{descMap[head]}</span>
      </div>
    );
    return (
      <Tooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#E5E3FF] hover:shadow-md transition-shadow cursor-pointer w-full max-w-xs">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <i className={`bi ${logoMap[head]} text-xl mr-3 md:text-lg`}></i>
                <div className="rate-heading">
                  <span className="lg:text-sm md:text-xs lg:font-medium md:font-normal text-[#6A6792]">
                    {head}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                {loading ? (
                  <Skeleton />
                ) : (
                  <div className="lg:text-2xl md:text-xl lg:font-bold md:font-semibold text-[#4A476B]">
                    {head === "Average Rating" ? (
                      typeof value === "number" ? (
                        <CountUp
                          start={0}
                          end={value.toFixed(2)}
                          duration={3}
                          delay={1}
                        />
                      ) : (
                        "--"
                      )
                    ) : (
                      <CountUp start={0} end={value} duration={3} delay={1} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Heading */}
      {/* <div className="text-lg font-semibold text-[#4A476B] mb-2">
        Review & Rating Analysis
      </div> */}
      <div className="flex flex-wrap gap-6 mt-4">
        {renderCard("Average Rating", props.rating)}
        {renderCard("Total Reviews", props.review)}
      </div>
    </div>
  );
}
