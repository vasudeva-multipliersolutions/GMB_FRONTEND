import React from 'react'
import { Chart } from "react-google-charts";

export default function GraphicalContainer(props) {
    const data = [
        ['Month', 'Count']
    ];
    var count = 0
    Object.entries(props.callsGraphData).map(([key, value]) => {
        count += value
        if(key != "_id")
        {
            const temp = [key, value]
            data.push(temp)
        }
    })
    
    const options = {
        title: '',
        hAxis: {title: 'Month',  titleTextStyle: {color: '#028ec0'}},
        vAxis: {minValue: 0, gridlines: {color: 'transparent'}},
        backgroundColor: { fill: props.bcolor, opacity: 0.8 }
    };
  return (
    <>
          <div className="graphical-container p-3 m-1" style={{ backgroundColor: ( props.bcolor ), width: (props.width)}}>
              Last 3 Months
            <center className="m-4"><h6>{props.title} - {count}</h6></center>
            <Chart chartType={props.gtype} chartWrapperParams={{ width: '8000px', height: '600px' }} data={data} options={options}></Chart>
        </div>
    </>
  )
}
