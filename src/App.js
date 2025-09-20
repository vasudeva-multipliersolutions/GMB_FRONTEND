import "bootstrap/dist/css/bootstrap.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DocReport from "./pages/DocReport";
import Review from "./pages/Review";
import "./App.css";
import Insights from "./pages/Insights";
import WorkTracker from "./components/Worktracker/WorkTracker";

import Matrics from "./components/Worktracker/Matrics"
import { SidebarProvider } from "./SidebarContext";
import PhoneMetrics from "./pages/PhoneMetrics";
import Verification from "./pages/Verification";
import Phone from "./pages/PhoneMetrics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



function App() {
  const isAuthenticated = !!localStorage.getItem("mail");

  return (
    <SidebarProvider>

      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route
            path="/Dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route
            path="/Doc-report"
            element={isAuthenticated ? <DocReport /> : <Navigate to="/" />}
          />
          <Route
            path="/Phone-Metrics"
            element={isAuthenticated ? <PhoneMetrics /> : <Navigate to="/" />}
          />
          <Route
            path="/Insights"
            element={isAuthenticated ? <Insights /> : <Navigate to="/" />}
          />
          <Route
            path="/WorkTracker"
            element={isAuthenticated ? <WorkTracker /> : <Navigate to="/" />}
          />
          <Route
            path="/Matrics"
            element={isAuthenticated ? <Matrics></Matrics> : <Navigate to="/" />}
          />

          {/* {<Route
          path="/Review Management"
          element={isAuthenticated ? <Review /> : <Navigate to="/" />}
        /> } */}
          {/*<Route path="/Review-management" element={<Review/>}/> */}
        </Routes>
      </HashRouter>
    </SidebarProvider>
  );
}

export default App;
