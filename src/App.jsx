import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import AvailabilitySlots from "./components/AvailabilitySlots";
import EducationDetails from "./components/EducationDetails";
import Navbar from "./components/Navbar";
import FoodCategory from "./components/FoodCategory";
import FoodType from "./components/FoodType";
import GenderType from "./components/GenderType";
import MaritalStatus from "./components/MaritalStatus";
import PreferredSkill from "./components/PreferredSkill";
import WorkCategory from "./components/WorkCategory";
import PreferredLanguage from "./components/PreferredLanguage";
import PreferredWorkLocation from "./components/PreferredWokLocation";
import Login from "./components/Login"; // Add a new login component
import Proficiency from "./components/Proficiency";
import Home from "./components/Home";
import Maids from "./components/Maids";
import RegisterMaid from "./components/RegisterMaid";

function App() {
  // Initialize authentication state from localStorage or default to false
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = (username, password) => {
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    } else {
      alert("Invalid credentials");
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove login status from localStorage
    setIsAuthenticated(false);
  };

  const AdminRoute = ({ element, ...rest }) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <div className="min-h-screen ml-64 bg-[#f8f8f8] p-16">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <div>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<AdminRoute element={<Home />} />} />
            <Route
              path="/availabilityslots"
              element={<AdminRoute element={<AvailabilitySlots />} />}
            />
            <Route
              path="/educationdetails"
              element={<AdminRoute element={<EducationDetails />} />}
            />
            <Route
              path="/foodcategory"
              element={<AdminRoute element={<FoodCategory />} />}
            />
            <Route
              path="/foodtype"
              element={<AdminRoute element={<FoodType />} />}
            />
            <Route
              path="/gendertype"
              element={<AdminRoute element={<GenderType />} />}
            />
            <Route
              path="/maritalstatus"
              element={<AdminRoute element={<MaritalStatus />} />}
            />
            <Route
              path="/preferredskills"
              element={<AdminRoute element={<PreferredSkill />} />}
            />
            <Route
              path="/workcategory"
              element={<AdminRoute element={<WorkCategory />} />}
            />
            <Route
              path="/preferredlanguages"
              element={<AdminRoute element={<PreferredLanguage />} />}
            />
            <Route
              path="/preferredworklocations"
              element={<AdminRoute element={<PreferredWorkLocation />} />}
            />
            <Route path="/proficiency" element={<Proficiency />} />
            <Route path="/maids" element={<Maids />} />
            <Route path="/registermaid" element={<RegisterMaid />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
