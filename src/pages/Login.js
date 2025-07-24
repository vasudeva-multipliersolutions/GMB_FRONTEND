import React, { useState, useEffect } from "react";
import "../stylesheets/login.css";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();

  const [cred, setCred] = useState({ username: "", psw: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("psw")) {
      navigate("/Dashboard");
    }
  }, []);

  function getCredentials(event) {
    const { name, value } = event.target;
    setCred({
      ...cred,
      [name]: value,
    });
  }

  const showError = (msg) => {
    setErrorMessage(msg);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setErrorMessage("");
    }, 4000); // Hide after 3 seconds
  };

  async function signin(e) {
    e.preventDefault();

    try {
      const loginHandeler = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: cred.username, psw: cred.psw }),
      });

      if (loginHandeler.ok) {
        const response = await loginHandeler.json();

        if (response && response[0]._id) {
          navigate("/verification", { state: { userId: response[0]._id } });
        } else {
          showError("User ID not found in response.");
        }

      } else if (loginHandeler.status === 401) {
        showError("Incorrect username or password.");
      } else if (loginHandeler.status === 500) {
        showError("Server error. Please try again later.");
      } else {
        showError(`Unexpected error: ${loginHandeler.status}`);
      }

    } catch (error) {
      showError("Network error. Please check your connection.");
    }
  }

  return (
    <>
      {showPopup && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          zIndex: 1000,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}>
          {errorMessage}
        </div>
      )}

      <div className="login-page p-4">
        <div className="login-container p-5">
          <div className="login-main p-2">
            <div className="login-main-content">
              <span>Sign In to</span>
              <br />
              <span>your</span>
              <br />
              <span>GOOGLE MY</span>&nbsp;<span> BUSINESS PERFORMANCE</span>
            </div>
            <div className="login-content p-2">
              <label className="p-2">Username</label>
              <input
                className="p-2 m-2"
                type="text"
                name="username"
                placeholder="Username"
                value={cred.username}
                onChange={getCredentials}
              />
              <label className="p-2">Password</label>
              <input
                className="p-2 m-2"
                type="password"
                name="psw"
                placeholder="Password"
                value={cred.psw}
                onChange={getCredentials}
              />
            </div>
            <div className="login-button">
              <button type="button" onClick={signin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
        <footer>© Copyright 2025, Multiplier AI. All rights reserved.</footer>
      </div>
    </>
  );
}
