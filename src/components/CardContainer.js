import React, { useState, useEffect } from "react";
import SlidePreloader from "../components/SlidePreloader"; // Import the preloader component
import { useContext } from "react";
import { SharedContext } from "../context/SharedContext";

export default function CardContainer(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a 2-second delay before showing the actual content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  const logoMap = {
    "Total Profiles": ' bi-puzzle',
    "Verified Profiles": 'bi-check2-circle',
    "Unverified Profiles": ' bi-slash-circle',
    "Not Intrested": 'bi-bookmark-dash',
    "Out of Organization": 'bi-buildings',
    'Google Search Mobile': ' bi-phone',
    'Google Search Desktop': 'bi-window-dock ',
    'Google Maps Mobile': 'bi-geo-alt',
    'Google Maps Desktop': 'bi-pc-display-horizontal',
    'Calls': 'bi-telephone-inbound',
    'Directions': 'bi-signpost-split',
    'Website Clicks': ' bi-sliders',
    'Searches' : 'bi-search',
  };

  return (
    <>
      <div className="view-counts ">
        <div className="view-card">
          {" "}
          <div className="rate-body">
            {loading ? <SlidePreloader /> : props.val}{" "}
            {/* Show preloader while loading */}
          </div>

          <div className="rate-heading">
            <span>{props.head}</span>
          </div>
        </div>
        <div className="docIcon d-flex align-items-center ">
            <i class={`bi ${logoMap[props.head]}`} style={{ fontSize: '1.5rem', color: '#16A34A', display : window.innerWidth > 768 ? 'block' : 'none'
 }}></i>
          </div>
      </div>
    </>
  );
}