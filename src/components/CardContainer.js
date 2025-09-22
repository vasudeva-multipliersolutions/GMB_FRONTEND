import React, { useState, useEffect } from "react";
import SlidePreloader from "../components/SlidePreloader";
import { Skeleton, Tooltip } from "@mui/material";

export default function CardContainer(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const logoMap = {
    "Total Profiles": 'bi-puzzle text-[#8D89BF]',
    "Verified Profiles": 'bi-check2-circle text-green-500',
    "Unverified Profiles": 'bi-slash-circle text-yellow-500',
    "Not Intrested": 'bi-bookmark-dash text-red-500',
    "Out of Organization": 'bi-buildings text-blue-500',
    'Google Search Mobile': 'bi-phone text-green-500',
    'Google Search Desktop': 'bi-window-dock text-green-500',
    'Google Maps Mobile': 'bi-geo-alt text-green-500',
    'Google Maps Desktop': 'bi-pc-display-horizontal text-green-500',
    'Calls': 'bi-telephone-inbound text-green-500',
    'Directions': 'bi-signpost-split text-green-500',
    'Website Clicks': 'bi-sliders text-green-500',
    'Searches': 'bi-search text-green-500',
    'Department': 'bi-building-fill text-[#8D89BF]',
    'Hospitals': 'bi-radar text-[#8D89BF]',
    'Doctor': 'bi-clipboard-pulse text-[#8D89BF]',
    'Clinic': 'bi-heart-pulse text-[#8D89BF]',
    'MARS': 'bi-pie-chart-fill text-[#8D89BF]',
    'Need Access': 'bi-exclamation-circle text-[#66D2DF]',
  };

  // Add your descriptions here
  const descMap = {
    "Total Profiles": "Total number of profiles in the system.",
    "Verified Profiles": "Count of all verified profiles.",
    "Unverified Profiles": "Profiles awaiting verification (includes Need to Verify & Suspended).",
    "Not Intrested": "Profiles marked as not interested (Doctors declined to create profiles).",
    "Out of Organization": "Profiles Out of Organization (Doctors who have left the organization).",
    "Google Search Mobile": "Searches performed on Google using mobile devices.",
    "Google Search Desktop": "Searches performed on Google using desktop devices.",
    "Google Maps Mobile": "Searches on Google Maps using mobile devices.",
    "Google Maps Desktop": "Searches on Google Maps using desktop devices.",
    "Calls": "Number of calls made from the profile.",
    "Directions": "Number of times directions were requested.",
    "Website Clicks": "Number of clicks to the website.",
    "Searches": "Total number of searches.",
    "Department": "Total departments listed.",
    "Hospitals": "Total hospitals listed.",
    "Doctor": "Total doctors listed.",
    "Clinic": "Total clinics listed.",
    "MARS": "MARS metric value.",
    "Need Access": "Profiles that need access (Lost access or doctor-claimed profiles).",
  };

  // Compose tooltip content with logo and description
  const tooltipContent = (
    <div className="flex items-center gap-2">
      <i className={`bi ${logoMap[props.head]} text-lg`} />
      <span>{descMap[props.head] || props.head}</span>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-[#E5E3FF] hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <i className={`bi ${logoMap[props.head]} text-xl mr-3 md:text-lg`}></i>
              <div className="rate-heading">
                <span className="lg:text-sm md:text-xs lg:font-medium md:font-normal text-[#6A6792]">{props.head}</span>
              </div>
            </div>
            <div className="mt-2">
              {loading ? (
                <Skeleton />
              ) : (
                <div className="lg:text-2xl md:text-xl lg:font-bold md:font-semibold text-[#4A476B]">
                  {Number(props.val).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}