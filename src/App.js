import "bootstrap/dist/css/bootstrap.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DocReport from "./pages/DocReport";
import Review from "./pages/Review";
import "./App.css";
import Insights from "./pages/Insights";

function App() {
  const isAuthenticated = !!localStorage.getItem("mail");

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/Dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/Doc-report"
          element={isAuthenticated ? <DocReport /> : <Navigate to="/" />}
        />
         <Route
          path="/Insights"
          element={isAuthenticated ? <Insights/> : <Navigate to="/" />}
        />
        {/* <Route
          path="/Review Management"
          element={isAuthenticated ? <Review /> : <Navigate to="/" />}
        /> */}
        {/* <Route path="/Review-management" element={<Review/>}/> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
