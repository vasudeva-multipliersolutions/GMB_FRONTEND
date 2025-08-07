import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../stylesheets/login.css";
import axios from "axios";

const Verification = () => {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  // console.log("userId--------->", userId);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const updatedInputs = [...inputsRef.current];
    updatedInputs[index].value = value;
    setToken(updatedInputs.map((input) => input.value).join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').trim();
    if (!/^[0-9]{6}$/.test(paste)) return;

    paste.split('').forEach((char, i) => {
      inputsRef.current[i].value = char;
    });

    setToken(paste);
    inputsRef.current[5]?.focus();
    e.preventDefault();
  };


  const showError = (msg) => {
    setErrorMessage(msg);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setErrorMessage("");
    }, 4000); // Hide after 3 seconds
  };

  const verify2FA = async () => {

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/verification`, {
        userId,
        token
      });

      if (res){
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("psw", res.data.user.psw);
      localStorage.setItem("mail", res.data.user.mail);
      localStorage.setItem("logo", res.data.user.Logo);
      localStorage.setItem("API", res.data.user.API);
      localStorage.setItem("user", res.data.user.user);
      localStorage.setItem("Branch", res.data.user.Branch);
      localStorage.setItem("Cluster", res.data.user.Cluster);
      localStorage.setItem("loginEmail", res.data.user.orgEmail);
      navigate("/Dashboard");
      window.location.reload();
      //console.log("---------------------", res.data.user.psw);
      //console.log("token--------->", res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/Dashboard");
      } else if (res.status === 404)  {
        showError("User not found");
      } else if (res.status === 400) {
        showError("Invalid OTP Code. Please try again.");
      }
    } catch (error) {
      showError("Try again. " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
    <div className="login-page ">
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

    <div className="  d-flex flex-column justify-content-center align-items-center min-vh-100">
      {/* <div className="mb-3">
        <img
          src="https://multipliersolutions.in/manipalhospitals/manipallogo2.png"
          alt="manipalhospitals"
          style={{ width: '200px' }}
        />
      </div> */}
      <div className="bg-white p-4 rounded shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-3 text-center">
          <img
            src="https://multipliersolutions.in/manipalhospitals/manipallogo2.png"
            alt="manipalhospitals"
            style={{ width: '200px' }}
          />
        </div>
        <p className="text-muted mb-4">Your code was sent to you via email</p>

        <form
          className="d-flex justify-content-center gap-2 mb-4"
          onPaste={handlePaste}
          onSubmit={(e) => {
            e.preventDefault();
            verify2FA();
          }}
        >
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="form-control text-center fw-bold"
              style={{ width: "40px", height: "40px", fontSize: "1.25rem" }}
            />
          ))}
        </form>

        <button
          onClick={verify2FA}
          className="verify-btn btn btn-primary w-75 fw-semibold"
        >
          Verify
        </button>

        <p className="mt-3 text-muted">
          Didn't receive code?{" "}
          <Link to="/"  className="text-primary text-decoration-none">Request again</Link>
        </p>
      </div>
    </div>
    </div>
    </>
  );

};

export default Verification;
