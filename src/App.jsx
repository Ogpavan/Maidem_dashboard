import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

// Import other components

function App() {
  return (
    <Router>
      <div className="min-h-screen ml-64 bg-[#e2ceaa]">
        <div>
          <Navbar />
        </div>
        <div>
          <Routes>
            <Route path="/" element={<AvailabilitySlots />} />
            <Route path="/educationdetails" element={<EducationDetails />} />
            <Route path="/foodcategory" element={<FoodCategory />} />
            <Route path="/foodtype" element={<FoodType />} />
            <Route path="/gendertype" element={<GenderType />} />
            <Route path="/maritalstatus" element={<MaritalStatus />} />
            <Route path="/preferredskills" element={<PreferredSkill />} />
            <Route path="/workcategory" element={<WorkCategory />} />
            <Route path="/preferredlanguages" element={<PreferredLanguage />} />
            <Route
              path="/preferredworklocations"
              element={<PreferredWorkLocation />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
