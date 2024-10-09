import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../Worktracker/Worktracker.css"; // Import your CSS
import * as XLSX from "xlsx";

import WorkUpload from "./WorkUpload";
import WorkTrackerMetrics from "./WorkTrackerMetrics";
import { SidebarContext } from "../../SidebarContext";

export default function WorkTracker() {
  const [showAllData, setAllData] = useState(null);
  const [getAllnames, setAllNames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [getCitys, setCitys] = useState([]);
  const [getStates, setStates] = useState([]);
  const [getState, setState] = useState("");
  const [getCity, setCity] = useState("");
  const [time, setTime] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to manage success modal visibility
  const [showErrorModal, setShowErrorModal] = useState(false); // State to manage error modal visibility
  const [getIndex, setIndex] = useState();
  const [showWorkUpload, setShowWorkUpload] = useState(false);

  const api = localStorage.getItem("API");

  const email = localStorage.getItem("email");

  const now = new Date();
  const { isCollapsed } = useContext(SidebarContext);
  const { windowWidth } = useContext(SidebarContext);

  useEffect(() => {
    handleAddTask();
  }, []);

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        cluster: "",
        location: "",
        updatetask: "",
        doctorname: "",
        comments: "",
        profilestatus: "",
        landingPageLink: "",
      },
    ]);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1); // Remove 1 item from updated tasks according to index
    setTasks(updatedTasks);
  };

  const validateTasks = () => {
    return tasks.every(
      (task) =>
        task.cluster &&
        task.location &&
        task.updatetask &&
        task.landingPageLink &&
        task.doctorname &&
        task.comments &&
        task.profilestatus
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateTasks()) {
      setShowErrorModal(true);
      return; // Stop form submission
    }
    const currentDate = new Date().toLocaleDateString();

    try {
      const response = await fetch(`http://localhost:2024/api/manipal/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks, date: currentDate }),
      });
      console.log("00000000 : " + tasks);

      if (response.ok) {
        setShowSuccessModal(true);
        //LoadToExcel(tasks);
      } else {
        console.error("Failed to submit tasks");
      }
    } catch (error) {
      console.error("Error submitting tasks:", error);
    }
    console.log("Submitted tasks:", tasks);
  };

  const LoadToExcel = (tasks) => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;

    if (field === "cluster") {
      // If the state (cluster) changes, reset the city (location) field
      updatedTasks[index].location = "";
      setState(value); // Update state
      // Fetch new city options based on selected state
      setCity(""); // Clear the city state
    } else if (field === "location") {
      setCity(value); // Update city
      filterApi(value);
    }

    setTasks(updatedTasks);
  };
  async function filterApi(branch) {
    try {
      const response = await fetch(
        `http://localhost:2024/api/manipal/getfilterdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: getState, branch: getCity || branch }),
        }
      );
      const data = await response.json();
      if (data.result[0].branches) {
        // Check if the API response contains new city data
        setCitys(data.result[0].branches);
      }
      if (data.result[0].businessNames) {
        setAllNames(data.result[0].businessNames); // Update getAllnames state
      }
      console.log("123: " + setCitys);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    async function getallLoc() {
      try {
        const response = await fetch(
          `http://localhost:2024/api/manipal/getunquelocdata`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const locDetails = await response.json();
        console.log("check it --------------------->", locDetails);
        setStates(locDetails[0].states);
        setCitys(locDetails[0].branches);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
    getallLoc();
  }, [api]);

  useEffect(() => {
    if (getState) {
      filterApi(); // Fetch cities whenever the selected state changes
    }
  }, [getState]);

  // Function to handle success modal close and refresh the page
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // window.location.reload(); // Refresh the page

    setTasks([
      {
        cluster: "",
        location: "",
        updatetask: "",
        doctorname: "",
        comments: "",
        profilestatus: "",
        landingPageLink: "",
      },
    ]); // Reset tasks to initial empty state
  };
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleCloseWorkUpload = () => {
    setShowWorkUpload(false); // Close the WorkUpload modal
  };
  // Function to handle error modal close

  return (
    <>
      <Navbar worktracker={true} />
      <WorkUpload show={showWorkUpload} onHide={handleCloseWorkUpload} />
      <div className="worktracker-container" style={{
          marginLeft: windowWidth > 768 ? (isCollapsed ? "80px" : "250px") : 0,
          transition: "margin-left 0.5s ease",
        }}>
        <Row className="Container mt-5">
          <Col className="m-3 p-3">
            <div className="  mt-5 mb-4 d-flex justify-content-between">
              <div>
                <h1 className="text-info ">Please fill the tasks below</h1>
              </div>
              <div>
                {" "}
                <Button
                  variant="secondary"
                  className="btn-lg"
                  onClick={() => handleDeleteTask(getIndex)}
                >
                  Delete
                </Button>
              </div>
              <div>
                <Button
                  variant="info"
                  className="btn-lg"
                  onClick={() => setShowWorkUpload(true)}
                >
                  Upload File
                </Button>
              </div>
              <div>
                <Button
                  variant="success"
                  className="btn-lg"
                  onClick={() => setShowWorkUpload(true)}
                >
                  Upload In Excel
                </Button>
              </div>

              <div>
                <Button
                  className="btn-lg"
                  variant="primary"
                  onClick={handleAddTask}
                >
                  Add
                </Button>
              </div>
            </div>
            <Form onSubmit={handleSubmit}>
              {tasks.map((task, index) => (
                <div key={index} className="mb-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId={`cluster-${index}`}>
                        <Form.Select
                          size="lg"
                          className="form-select"
                          value={task.cluster}
                          onChange={(e) =>
                            handleChange(index, "cluster", e.target.value)
                          }
                        >
                          <option value="">Cluster</option>
                          {getStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`location-${index}`}>
                        <Form.Select
                          size="lg"
                          className="form-select"
                          value={task.location}
                          onChange={(e) =>
                            handleChange(index, "location", e.target.value)
                          }
                        >
                          <option value="">Location</option>
                          {getCitys &&
                            getCitys.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId={`updatetask-${index}`}>
                        <Form.Select
                          size="lg"
                          className="form-select"
                          value={task.updatetask}
                          onChange={(e) =>
                            handleChange(index, "updatetask", e.target.value)
                          }
                        >
                          <option value="Profile Creation">
                            Profile Creation
                          </option>
                          <option value="Verification">Verification</option>
                          <option value="Optimization">Optimization</option>
                          <option value="Posting">Posting</option>
                          <option value="Keyword Analysis">
                            Keyword Analysis
                          </option>
                          <option value="Sheet Updation">Sheet Updation</option>
                          <option value="Raising Tickets">
                            Raising Tickets
                          </option>
                          <option value="Others">Others</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`doctorname-${index}`}>
                        <Form.Control
                          size="lg"
                          list={`doclist-${index}`}
                          className="form-control"
                          value={task.doctorname}
                          onChange={(e) =>
                            handleChange(index, "doctorname", e.target.value)
                          }
                        />
                        {getAllnames && (
                          <datalist id={`doclist-${index}`}>
                            {getAllnames.map((item) => {
                              return <option value={item}>{item}</option>;
                            })}
                          </datalist>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3 mb-3">
                    <Col md={12}>
                      <Form.Group controlId={`comments-${index}`}>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          size="lg"
                          className="form-control"
                          value={task.comments}
                          placeholder="Work Done"
                          onChange={(e) =>
                            handleChange(index, "comments", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-5">
                      <Form.Group controlId={`profilestatus-${index}`}>
                        <Form.Control
                          size="lg"
                          className="form-control"
                          type="text"
                          value={task.profilestatus}
                          placeholder="Profile Status"
                          onChange={(e) =>
                            handleChange(index, "profilestatus", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-5">
                      <Form.Group controlId={`landingPageLink-${index}`}>
                        <Form.Control
                          size="lg"
                          className="form-control"
                          type="text"
                          value={task.landingPageLink}
                          placeholder="GMB Link"
                          onChange={(e) =>
                            handleChange(
                              index,
                              "landingPageLink",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col
                      md={2}
                      className="d-flex justify-content-end align-items-center"
                    ></Col>
                  </Row>
                </div>
              ))}
              <div className="button-container">
                <Row className="mt-2">
                  <Col md={6} className="d-flex justify-content-end">
                    {/* <Link to="/WorkTrackerMatrics" className="p-1 pe-5">
                      Matrics
                    </Link> */}
                    <Button
                      type="submit"
                      className="btn btn-lg ms-3 "
                      variant="success"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </Col>
        </Row>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Work Updated Successfully</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please enter the Information</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
