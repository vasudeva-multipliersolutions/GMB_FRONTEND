import React from 'react'
import CountUp from 'react-countup';

export default function ReviewRating(props) {
  return (
    <>
        
        <div className="vertical-card ">
        <div className="graphs ">All Time</div>
            <center className="m-4">Overall</center>
            <div className="rating-container  m-3">
                <div className="rate-body">
                      {props.rating && <CountUp start={0} end={props.rating.toFixed(2)} duration={3} delay={1} />}
                </div>
                <div className="rate-heading">
                    Average Rating
                </div>
            </div>
            <div className="rating-container m-3">
                <div className="rate-body">
                <CountUp start ={0} end={props.review} duration={3} delay={1}/> 
                </div>
                <div className="rate-heading">
                    Total Reviews
                </div>
            </div>
        </div>
    </>
  )
}
