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

      if (res) {
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
      } else if (res.status === 404) {
        showError("User not found");
      } else if (res.status === 400) {
        showError("Invalid OTP Code. Please try again.");
      }
    } catch (error) {
      showError((error.response?.data?.message || error.message) + ". Please try again.");
    }
  };

  return (
    <>


      {/* Full Screen Split Layout */}
      <div className="flex h-screen">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2">
          <img
            src="https://multiplierai.co/gmbtest/otpvalidation.png"
            alt="Verification Visual"
            className="w-full h-full mx-28  object-cover"
          />
        </div>

        {/* Right Side - OTP Verification */}
        <div className="flex w-full md:w-1/2 flex-col justify-start pt-64  bg-white ">
          {/* Logo */}
          <div className="mb-2 flex justify-center">
            <img
              src="https://multipliersolutions.in/manipalhospitals/manipallogo2.png"
              alt="manipalhospitals"
              className=" w-28"
            />
          </div>

          {/* Heading */}

          <h2 className="text-4xl font-bold text-gray-800 mb-2 flex justify-center">Verify Code</h2>
          <p className="text-gray-500 text-[0.9rem] mb-6 flex justify-center">
            Your code was sent to you via email
          </p>

          {/* OTP Input Boxes */}
          <form
            className="flex justify-center gap-3 mb-6"
            onPaste={handlePaste}
            onSubmit={(e) => {
              e.preventDefault();
              if (!token || token.length < 6) {
                showError("Please enter OTP");
                return;
              }
              verify2FA();  // Trigger on Enter
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
                className="w-16 h-16 border border-gray-300 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </form>



          {/* Verify Button */}
          <div className="flex justify-center">
            <button
              onClick={verify2FA}
              className="flex justify-center px-52 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Verify
            </button>
          </div>

          {/* Resend Link */}
          <p className=" flex justify-center mt-6 text-gray-500 text-[0.9rem]">
            Didn't receive code? {" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Request again
            </Link>
          </p>


        </div>
        {/* Error Popup */}
        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "White",
              color: "#f44336",
              padding: "20px 40px",
              borderRadius: "2px",
              borderBlockColor: "#f44336",
              zIndex: 1000,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>


    </>
  );
};

export default Verification;
