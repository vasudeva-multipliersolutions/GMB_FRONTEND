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
    {/* Error Popup */}
    {showPopup && (
      <div
        style={{
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
        }}
      >
        {errorMessage}
      </div>
    )}

    {/* Full Screen Split */}
    <div className="flex h-screen border shadow-lg rounded-lg overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2">
        <img
          src="https://multiplierai.co/gmbtest/loginpageimage.png"
          alt="Login Visual"
          className="w-full h-full object-cover mx-16"
        />
      </div>

      {/* Right Side - Login */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-48 bg-white mx-16">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 text-[0.9rem]">
            Access your{" "}
            <span className="font-semibold">Google My Business Performance</span>
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-[0.9rem]">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={cred.username}
              onChange={getCredentials}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-[0.9rem]">
              Password
            </label>
            <input
              type="password"
              name="psw"
              placeholder="Enter your password"
              value={cred.psw}
              onChange={getCredentials}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="button"
          onClick={signin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-8 hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-10">
          © Copyright 2025, <span className="font-semibold">Multiplier AI</span>. All rights reserved.
        </p>
      </div>
    </div>
  </>
);



}
