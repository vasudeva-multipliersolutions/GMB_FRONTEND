import React, { useEffect, useState } from 'react';
import { ShimmerTable } from "react-shimmer-effects";

export default function DoctorTableComponent(props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { 
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [props.rows]);

    return (
        <>
            <div className="table-component m-2" style={{ backgroundColor: props.bcolor, opacity: 0.7, borderRadius: '1rem' }}>
                <span className='table-heading graphs'>
                    {props.title}
                </span>
                {isLoading ? (
                    <ShimmerTable row={5} col={5} />
                ) : (
                    <table className="table table-striped mt-4">
                        <thead>
                            <tr>      
                                {props.head.map((item, index) => (
                                    <th key={index}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {props.rows && props.rows[0].map((item, i) => (
                                <tr key={i}>
                                    {item.map((counts, j) => (
                                        <td key={j}>{counts}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
