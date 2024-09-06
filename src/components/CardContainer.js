import React, { useState, useEffect } from 'react';
import SlidePreloader from '../components/SlidePreloader'; // Import the preloader component
import { useContext } from 'react';
import { SharedContext } from '../context/SharedContext';
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

  return (
    <>
      <div className="view-counts m-2">
        <div className="rate-heading">
          <span>{props.head}</span>
        </div>
        <div className="rate-body">
          {loading ? <SlidePreloader /> : props.val} {/* Show preloader while loading */}
        </div>
      </div>
    </>
  );
}