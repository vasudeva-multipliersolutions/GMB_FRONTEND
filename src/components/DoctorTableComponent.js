import React, { useContext, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { ShimmerTable } from 'react-shimmer-effects';
import { FaCaretUp } from 'react-icons/fa6';
import { FaCaretDown } from 'react-icons/fa';
import { SharedContext } from "../context/SharedContext";

export default function DoctorTableComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const { contextDepartment} = useContext(SharedContext);

    // Handle sorting logic
    const sortedRows = React.useMemo(() => {
        if (!props.rows || !props.rows.length) return [];
        const sortedData = [...props.rows[0]];

        if (sortConfig.key !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return [sortedData];
    }, [props.rows, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    setTimeout(() => {
        setIsLoading(false);
    }, 500);

    return (
        <TableContainer component={Paper} sx={{ margin: '20px 0', backgroundColor: props.bcolor, opacity: 0.9,  borderRadius : '1rem' }}>
            <div className='graphs'><h3 style={{ padding: '16px', textAlign: 'center', color: 'white', }}>Top {contextDepartment ? contextDepartment : "Profiles"} Data</h3></div>
            {isLoading ? (
                <ShimmerTable row={5} col={5} />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            {props.head.map((item, index) => (
                                <TableCell key={index} align="center" style={{ fontWeight: 'bold' }}>
                                    {item}
                                    {/* Disable sorting for the first column */}
                                    {index !== 0 && (
                                        <IconButton onClick={() => requestSort(index)} size="small">
                                            {sortConfig.key === index ? (
                                                sortConfig.direction === 'asc' ? <FaCaretUp/> : <FaCaretDown />
                                            ) : (
                                                <>
                                                    <FaCaretUp style={{ opacity: 0.3 }} />
                                                    <FaCaretDown style={{ opacity: 0.3 }} />
                                                </>
                                            )}
                                        </IconButton>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows && sortedRows[0].slice(0, 10).map((item, i) => (
                            <TableRow key={i} hover>
                                {item.map((counts, idx) => (
                                    <TableCell key={idx} align="center">
                                        {counts}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
}
