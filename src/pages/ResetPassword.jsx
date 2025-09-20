import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../stylesheets/login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [psw, setPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification color and icon logic (same as ForgotPassword.jsx)
  const getPopupStyle = (type) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#E6FAF0",
          color: "#1A7F37",
          border: "1px solid #A6F4C5",
          icon: (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="#1A7F37"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#A6F4C5"
                strokeWidth="2"
                fill="#A6F4C5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
          ),
        };
      case "error":
        return {
          backgroundColor: "#FEE4E2",
          color: "#B42318",
          border: "1px solid #FECDCA",
          icon: (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="#B42318"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#FECDCA"
                strokeWidth="2"
                fill="#FECDCA"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9l-6 6m0-6l6 6"
              />
            </svg>
          ),
        };
      case "info":
        return {
          backgroundColor: "#EFF8FF",
          color: "#175CD3",
          border: "1px solid #B2DDFF",
          icon: (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="#175CD3"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#B2DDFF"
                strokeWidth="2"
                fill="#B2DDFF"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01"
              />
            </svg>
          ),
        };
      default:
        return {};
    }
  };

  const popupStyle = getPopupStyle(popup.type);

  const showPopupMsg = (type, msg) => {
    setPopup({ show: true, type, message: msg });
    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return "";
    const regexWeak = /.{6,}/;
    const regexMedium = /^(?=.*[a-z])(?=.*[0-9]).{6,}$/;
    const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (regexStrong.test(password)) return "Strong";
    if (regexMedium.test(password)) return "Medium";
    if (regexWeak.test(password)) return "Weak";
    return "";
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (psw !== confirmPsw) {
      showPopupMsg("error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ psw }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        showPopupMsg("success", "Password reset successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        if (data.error?.includes("expired")) {
          showPopupMsg("error", "Reset link has expired. Please request a new one.");
        } else if (data.error?.includes("invalid")) {
          showPopupMsg("error", "Invalid reset token.");
        } else {
          showPopupMsg("error", data.error || "Failed to reset password.");
        }
      }
    } catch (err) {
      showPopupMsg("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Password match border color
  const confirmBorder =
    confirmPsw.length === 0
      ? "border-gray-300"
      : psw === confirmPsw
      ? "border-green-500"
      : "border-red-500";

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
            src="https://multiplierai.co/gmbtest/resetpassword.png"
            alt="Reset Password Visual"
            className="w-full h-full object-cover mx-16"
          />
        </div>

        {/* Right Side - Reset Password */}
        <div className="flex w-full md:w-1/2 flex-col justify-center px-48 bg-white mx-16">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 text-[0.9rem]">
              Set a new{" "}
              <span className="font-semibold">password for your account</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2 text-[0.9rem]">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={psw}
                onChange={(e) => setPsw(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={loading}
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {psw && (
                <p
                  className={`mt-2 text-sm ${
                    getPasswordStrength(psw) === "Strong"
                      ? "text-green-600"
                      : getPasswordStrength(psw) === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Strength: {getPasswordStrength(psw)}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2 text-[0.9rem]">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPsw}
                onChange={(e) => setConfirmPsw(e.target.value)}
                className={`w-full border ${confirmBorder} rounded-lg px-4 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 outline-none`}
                required
                disabled={loading}
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-400 text-white py-3 rounded-lg mt-8 hover:bg-green-700 transition flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
              ) : null}
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-xs mt-10">
            © Copyright 2025,{" "}
            <span className="font-semibold">Multiplier AI</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </>
  );
}

