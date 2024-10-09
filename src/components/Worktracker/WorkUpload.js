import React, { useState } from "react";
import { Col, Container, Row, Modal, Form, Button } from "react-bootstrap";
import * as XLSX from "xlsx";

export default function WorkUpload({ show, onHide }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const api = localStorage.getItem("API");

  async function downloadtemplet() {
    const header = [
      "cluster",
      "location",
      "updatetask",
      "doctorname",
      "comment",
      "profilestatus",
      "landingPageLink",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([header]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UTasks");

    XLSX.writeFile(workbook, "UploadTasks.xlsx");
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const response = await fetch(`${api}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasks: jsonData }), 
        });

        if (response.ok) {
          setShowSuccessModal(true);
        } else {
          console.error("Failed to submit tasks");
        }
      } catch (error) {
        console.error("Error submitting tasks:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onHide(); // Close the WorkUpload modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Download Template and Upload Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button variant="secondary" className="btn  btn-lg" onClick={downloadtemplet}>
            Download Template
          </Button>
          <Form.Group controlId="fileUpload" className="ms-3">
            <Form.Label className="btn btn-primary btn-lg">
              Upload Excel
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                hidden
              />
            </Form.Label>
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tasks uploaded successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
}
