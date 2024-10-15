import React, { useState } from 'react'
import { ShimmerTable } from "react-shimmer-effects"

export default function DoctorTableComponent(props) {

    const [isLoading, setIsLoading] = useState(true)

    setTimeout(() => {
         setIsLoading(false);
     }, 500);
    
  return (
    <>
        <div className="table-component  m-2" style={{ backgroundColor: props.bcolor, opacity: 0.7,     borderRadius : '1rem'  }}>
            <span className='table-heading graphs'>
                {props.title}
            </span>
            {isLoading? <ShimmerTable row={5} col={5}/>:<table className="table table-striped mt-4 ">
                  <thead>
                      <tr>      
                        {props.head.map((item) => {
                            return(<th>{item}</th>)
                        })}
                      </tr>
                  </thead>
                  <tbody>      
                    {props.rows && props.rows[0].map((item, i) => {

                        return (
                            <>
                                <tr>
                                    {item.map((counts) => {
                                        return (<td>{counts}</td>)
                                    })}
                                </tr>
                            </>
                        )
                    })}
                  </tbody>
            </table>}
        </div>
    </>
  )
}
//here i have a table build it in such a way that every header column include a button which filter the whole data in acending or decending order 