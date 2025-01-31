import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Worktracker/Worktracker.css";
import * as XLSX from "xlsx";
import Calendar from "react-calendar";
import { SharedContext } from "../../context/SharedContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { SidebarContext } from "../../SidebarContext";

const date = new Date();
export default function WorkTrackerMetrics() {
  const [getTableData, setTableData] = useState([]);
  const [date, setDate] = useState(new Date()); // merged date state
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [showCalendar, setShowCalendarModal] = useState(false);
  const [getCalenderData, setCalenderData] = useState([]);
  const { getDrName, getInsightState, getInsightsCity, contextHospitals } =
    useContext(SharedContext);
  const user = localStorage.getItem("user");

  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);

  //const api = localStorage.getItem("API");

  const shortcutsItems = [
    {
      label: "This Week",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("week"), today.endOf("week")];
      },
    },
    {
      label: "Last Week",
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, "day");
        return [prevWeek.startOf("week"), prevWeek.endOf("week")];
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, "day"), today];
      },
    },
    {
      label: "Current Month",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("month"), today.endOf("month")];
      },
    },
    {
      label: "Next Month",
      getValue: () => {
        const today = dayjs();
        const startOfNextMonth = today.endOf("month").add(1, "day");
        return [startOfNextMonth, startOfNextMonth.endOf("month")];
      },
    },
    { label: "Reset", getValue: () => [null, null] },
  ];

  useEffect(() => {
    //console.log("********" + getInsightState + " ######### : " + getInsightsCity + "contextHospitals : "+ contextHospitals);
  }, [getInsightsCity, getInsightState, contextHospitals]);

  async function gettrackerdata(date) {
    try {
      const response = await fetch(
        `http://localhost:2024/api/manipal/trackerdata`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ date: date.toLocaleDateString() }),
        }
      );
      const data = await response.json();
      setTableData(data);
      //console.log("Work Tracker Data : " + data);
    } catch (error) {
      console.error("error in fetching data :", error);
    }
  }

  async function CalenderData() {
    const response = await fetch(
      `http://localhost:2024/api/manipal/getcalendardata`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.format("DD-MM-YYYY"), // Use format method
          endDate: endDate.format("DD-MM-YYYY"), // Use format method
        }),
      }
    );
    const data = await response.json();

    setCalenderData(data);
    setTableData(" ");
    closeCalendarModal();
  }

  async function handleCalendarModal() {
    setShowCalendarModal(true);
  }

  async function closeCalendarModal(params) {
    setShowCalendarModal(false);
  }

  const LoadToExcel = () => {
    const tableData = [];
    const tableHeaders = document.querySelectorAll("table thead th");
    const tableRows = document.querySelectorAll("table tbody tr");

    // Get table headers
    const headerData = [];
    tableHeaders.forEach((header) => {
      headerData.push(header.textContent);
    });
    tableData.push(headerData);

    // Get table rows
    tableRows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");

      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });

      tableData.push(rowData);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  useEffect(() => {
    gettrackerdata(date); // pass the selected date to the API
  }, [date]);

  useEffect(() => {
    async function matricsfilterdata() {
      // Set location based on contextHospitals or getInsightsCity
      const location = contextHospitals ? contextHospitals : getInsightsCity;
      const cluster = contextHospitals ? "" : getInsightState;
  
      try {
        const response = await fetch(
          `http://localhost:2024/api/manipal/matricsfilterdata`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cluster: cluster,
              location: location, // Dynamically set location
              doctorname: getDrName,
            }),
          }
        );
        const data = await response.json();
        //console.log("********" + data);
        setTableData(data);
      } catch (error) {
        console.error("Something Went Wrong" + error);
      }
    }
  
    matricsfilterdata();
  }, [getInsightsCity, getInsightState, getDrName, contextHospitals]);
  

  //console.log("12@@@@ ; " + user);

  return (
    <div>
      <div
        className="bg-custom"
        style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}
      >
        <div className="">
          <div className="d-flex justify-content-between">
            <div>
              <h1>Metrics</h1>
              <Button onClick={handleCalendarModal}>
                {" "}
                <i className="bi bi-calendar-date"></i>
              </Button>
              <Modal show={showCalendar} onHide={closeCalendarModal}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                  <div className="datediv bg-light rounded p-3"></div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateRangePicker
                      slotProps={{
                        shortcuts: {
                          items: shortcutsItems,
                        },
                        actionBar: { actions: [] },
                      }}
                      calendars={2}
                      value={[startDate, endDate]} // Ensure these are Day.js objects
                      onChange={(value) => {
                        if (value && value[0] && value[1]) {
                          setStartDate(dayjs(value[0])); // Convert to Day.js
                          setEndDate(dayjs(value[1])); // Convert to Day.js
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  {" "}
                  <Button onClick={CalenderData}>Get Details</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="button" onClick={() => LoadToExcel(getTableData)}>
              <i
                class="bi bi-file-earmark-arrow-up me-4"
                style={{ fontSize: "70px" }}
              ></i>
              <i class="bi bi-filetype-pdf" style={{ fontSize: "70px" }}></i>
            </div>
          </div>
        </div>

        <Row className="mt-5">
          <Col>
            <Table className="table table-striped table-rounded">
              <thead className="thead">
                <tr className="bg-black">
                  <th>Cluster</th>
                  <th>Unit</th>
                  <th>Task</th>
                  <th>Work Done</th>
                  <th>Doctors Name</th>
                  <th>Profile Status</th>
                  <th>GMB Link</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(getTableData) && getTableData.length > 0 ? (
                  getTableData.map((item, index) => {
                    return item.cluster.map((cluster, clusterIndex) => (
                      <tr key={clusterIndex}>
                        <td>{cluster}</td>
                        <td>{item.location[clusterIndex]}</td>
                        <td>{item.updatetask[clusterIndex]}</td>
                        <td>{item.comments[clusterIndex]}</td>
                        <td>{item.doctorname[clusterIndex] || "-"}</td>
                        <td>{item.profilestatus[clusterIndex]}</td>
                        <td>{item.landingPageLink[clusterIndex] || "-"}</td>
                        <td>{item.date[clusterIndex]}</td>
                      </tr>
                    ));
                  })
                ) : getCalenderData.length > 0 ? (
                  getCalenderData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.cluster}</td>
                        <td>{item.location}</td>
                        <td>{item.updatetask}</td>
                        <td>{item.comments}</td>
                        <td>{item.doctorname || "-"}</td>
                        <td>{item.profilestatus}</td>
                        <td>{item.landingPageLink || "-"}</td>
                        <td>{item.date}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8">No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}
