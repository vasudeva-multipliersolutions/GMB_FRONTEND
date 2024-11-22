import React, { useEffect, useState } from 'react';
import { ShimmerTable } from "react-shimmer-effects";
import * as XLSX from "xlsx";


export default function DoctorTableComponent(props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { 
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [props.rows]);

    useEffect(() => {
        if (props.downloadExcel) {
            LoadToExcel();
            props.setDownloadExcel(false); 
        }
    }, [props.downloadExcel])

      // Function to load table data to Excel
  const LoadToExcel = () => {
    const tableData = [];
    const tableHeaders = document.querySelectorAll("table thead th");
    const tableRows = document.querySelectorAll("table tbody tr");

    // Get table headers
    const headerData = [];
    tableHeaders.forEach((header) => {
      headerData.push(header.textContent.trim()); // Trim any extra spaces
    });
    tableData.push(headerData);

    // Get table rows
    tableRows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");

      cells.forEach((cell) => {
        rowData.push(cell.textContent.trim()); // Trim any extra spaces
      });

      tableData.push(rowData);
    });

    // Create the worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Write the Excel file
    XLSX.writeFile(workbook, "InsightsData.xlsx");
  };

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
