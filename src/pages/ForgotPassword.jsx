import React, { useState } from "react";
import "../stylesheets/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 4000);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        showPopup("success", "Reset link sent! Check your email.");
        setEmail(""); // Clear email field on success
      } else {
        // Show actual backend message if available
        showPopup("error", data.message || data.error || "Failed to send reset link.");
      }
    } catch (err) {
      showPopup("error", "Network error.");
    }
    setLoading(false);
  }

  // Notification color and icon logic
  const getPopupStyle = (type) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#E6FAF0",
          color: "#1A7F37",
          border: "1px solid #A6F4C5",
          icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="#1A7F37" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#A6F4C5" strokeWidth="2" fill="#A6F4C5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          ),
        };
      case "error":
        return {
          backgroundColor: "#FEE4E2",
          color: "#B42318",
          border: "1px solid #FECDCA",
          icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="#B42318" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#FECDCA" strokeWidth="2" fill="#FECDCA" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
            </svg>
          ),
        };
      case "info":
        return {
          backgroundColor: "#EFF8FF",
          color: "#175CD3",
          border: "1px solid #B2DDFF",
          icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="#175CD3" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#B2DDFF" strokeWidth="2" fill="#B2DDFF" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          ),
        };
      default:
        return {};
    }
  };

  const popupStyle = getPopupStyle(popup.type);

  return (
    <>
      {/* Notification Popup */}
      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "340px",
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            fontSize: "1rem",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "16px 24px",
            border: popupStyle.border,
            backgroundColor: popupStyle.backgroundColor,
            color: popupStyle.color,
          }}
        >
          {popupStyle.icon}
          <span>{popup.message}</span>
        </div>
      )}

      {/* Full Screen Split */}
      <div className="flex h-screen border shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2">
          <img
            src="https://multiplierai.co/gmbtest/forgotpassword.png"
            alt="Forgot Password Visual"
            className="w-full h-full object-cover mx-16"
          />
        </div>

        {/* Right Side - Forgot Password */}
        <div className="flex w-full md:w-1/2 flex-col justify-center px-48 bg-white mx-16">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
            <p className="text-gray-500 text-[0.9rem]">
              Enter your registered email to receive a{" "}
              <span className="font-semibold">password reset link</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-[0.9rem]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={loading}
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 rounded-lg mt-8 hover:bg-blue-700 transition flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-xs mt-10">
            © Copyright 2025, <span className="font-semibold">Multiplier AI</span>. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}



