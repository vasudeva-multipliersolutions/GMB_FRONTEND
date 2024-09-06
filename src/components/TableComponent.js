import React, { useState } from 'react'
import { ShimmerTable } from "react-shimmer-effects"

export default function TableComponent(props) {

    const [isLoading, setIsLoading] = useState(true)

    setTimeout(() => {
         setIsLoading(false);
     }, 500);
    
  return (
    <>
        <div className="p-3 m-2" style={{ backgroundColor: props.bcolor, opacity: 0.7 }}>
            <span className='table-heading'>
                {props.title}
            </span>
            {isLoading? <ShimmerTable row={5} col={5} /> :<table className="table table-striped mt-4">
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
