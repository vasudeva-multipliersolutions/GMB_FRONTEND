import React from 'react'
import CountUp from 'react-countup';

export default function ReviewRating(props) {
  return (
    <>
        
        <div className="vertical-card p-3">
            All Time
            <center className="m-4"><h4>Overall</h4></center>
            <div className="rating-container m-1">
                <div className="rate-heading">
                    Average Rating
                </div>
                <div className="rate-body">
                <CountUp start ={0} end={props.rating.toFixed(2)} duration={3} delay={1}/>
                </div>
            </div>
            <div className="rating-container m-1">
                <div className="rate-heading">
                    Total Reviews
                </div>
                <div className="rate-body">
                <CountUp start ={0} end={props.review} duration={3} delay={1}/> 
                </div>
            </div>
        </div>
    </>
  )
}
