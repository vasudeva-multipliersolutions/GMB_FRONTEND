import React, { useState, useEffect } from "react";
import SlidePreloader from "../components/SlidePreloader";
import { Skeleton } from "@mui/material";

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-[#E5E3FF] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <i className={`bi ${logoMap[props.head]} text-xl mr-3`}></i>
            <div className="rate-heading">
              <span className="text-sm font-medium text-[#6A6792]">{props.head}</span>
            </div>
          </div>
          
          <div className="mt-2">
            {loading ? (
              <Skeleton/>
            ) : (
              <div className="text-2xl font-bold text-[#4A476B]">{props.val}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}