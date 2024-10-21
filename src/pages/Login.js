import React, { useState, useEffect } from "react";
import "../stylesheets/login.css";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const [cred, setCred] = useState({ username: "", psw: "" });
  function getCredentials(event) {
    const { name, value } = event.target;
    setCred({
      ...cred,
      [name]: value,
    });
  }
  async function signin(e) {
    e.preventDefault();
    //console.log(cred);
    const loginHandeler = await fetch(
      `http://localhost:2024/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: cred.username, psw: cred.psw }),
      }
    );
    const response = await loginHandeler.json();
    if (response.length != 0) {
      localStorage.setItem("username", cred.username);
      localStorage.setItem("psw", cred.psw);
      localStorage.setItem("mail", response[0].mail);
      localStorage.setItem("logo", response[0].Logo);
      localStorage.setItem("API", response[0].API);
      localStorage.setItem("user", response[0].user);
      //console.log()

      navigate("/Dashboard");
      window.location.reload();
    } else {
      //console.log("false");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("psw")) {
      navigate("/Dashboard");
    }
  }, []);
  return (
    <>
      <div className="login-page p-4">
        {/* <div className='logo-session'> 
        <img src={logo}></img>
      </div> */}
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
              ></input>
              <label className="p-2">Password</label>
              <input
                className="p-2 m-2"
                type="password"
                name="psw"
                placeholder="Password"
                value={cred.psw}
                onChange={getCredentials}
              ></input>
            </div>
            <div className="login-button">
              <button type="button" onClick={signin}>
                {" "}
                Sign In{" "}
              </button>
            </div>
          </div>
        </div>
        <footer>© Copyright 2024, Multiplier AI. All rights reserved.</footer>
      </div>
    </>
  );
}
