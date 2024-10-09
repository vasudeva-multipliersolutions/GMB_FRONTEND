import React, { useContext } from 'react'
import { Chart } from "react-google-charts";
import { SidebarContext } from '../SidebarContext';

export default function GraphicalContainer(props) {
    const { isCollapsed } = useContext(SidebarContext);
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
        hAxis: { title: 'Month', titleTextStyle: { color: '#b1c4e9' } },
        vAxis: { minValue: 0, gridlines: { color: 'transparent' } },
        backgroundColor: { fill: props.bcolor, opacity: 0.8 },
        chartArea: isCollapsed ?
            { left: 80, right: 80 } : { left: 80, right: 155 },
            colors: ['#16A34A'],
    };
  return (
    <>
          <div  className="graphical-container m-2" style={{ backgroundColor: ( props.bcolor ),}}>
              <div className="graphs">Last 3 Months</div>
            <center className="m-4">{props.title} - {count}</center>
            <Chart chartType={props.gtype} chartWrapperParams={{ width: '400px', height: '600px',  }} style={{ margin: '5%', padding: '2%' }}data={data} options={options}></Chart>
        </div>
    </>
  )
}
