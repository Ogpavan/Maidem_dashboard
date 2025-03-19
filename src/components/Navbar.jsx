import React, { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  Calendar,
  Book,
  Users,
  Heart,
  Globe,
  Edit,
  Layers,
  FileText,
  MapPin,
  ChefHat,
  Pizza,
  ChevronDown,
  Home,
  UserRound,
  Cog,
  UserRoundCheck,
} from "lucide-react"; // Import icons
import { useLocation, useNavigate, Link } from "react-router-dom"; // Import Link
import logo from "../assets/logo.png";

const Navbar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigAppOpen, setIsConfigAppOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Availability Slots",
      to: "/availabilityslots",
      icon: <Calendar size={20} />,
    },
    {
      title: "Education Details",
      to: "/educationdetails",
      icon: <Book size={20} />,
    },
    {
      title: "Food Category",
      to: "/foodcategory",
      icon: <ChefHat size={20} />,
    },
    {
      title: "Food Type",
      to: "/foodtype",
      icon: <Pizza size={20} />,
    },
    { title: "Gender Type", to: "/gendertype", icon: <Users size={20} /> },
    {
      title: "Marital Status",
      to: "/maritalstatus",
      icon: <Heart size={20} />,
    },
    {
      title: "Preferred Skills",
      to: "/preferredskills",
      icon: <Edit size={20} />,
    },
    {
      title: "Work Category",
      to: "/preferredworktype",
      icon: <Layers size={20} />,
    },
    {
      title: "Preferred Languages",
      to: "/preferredlanguages",
      icon: <Globe size={20} />,
    },
    {
      title: "Proficiency",
      to: "/proficiency",
      icon: <FileText size={20} />,
    },
    {
      title: "Preferred Work Locations",
      to: "/preferredworklocations",
      icon: <MapPin size={20} />,
    },
    {
      title: "Cloudinary Details",
      to: "/cloudinarydetails",
      icon: <UserRound size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
    onLogout && onLogout();
  };

  return (
    <div className="relative">
      {/* Mobile menu overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"}
          border-r border-gray-200
          w-64 lg:translate-x-0
          bg-white text-black shadow-2xl`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <img src={logo} alt="Logo" className="" />
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg hover:bg-gray-100 hover:text-black lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] pl-4 pt-4">
          <div className="flex-1 overflow-auto pr-4">
            {/* Home Link */}
            <Link
              to="/"
              className={`flex items-center gap-4 px-4 py-3 mb-3 rounded-lg 
                ${
                  location.pathname === "/"
                    ? "bg-[#e2ceaa] text-black"
                    : "hover:bg-[#e2ceaa] hover:text-black"
                }`}
            >
              <span className="text-black flex items-center gap-x-2">
                <Home />
                Home
              </span>
            </Link>

            {/* Maids Link */}
            <Link
              to="/maids"
              className={`flex items-center gap-4 px-4 py-3 mb-3 rounded-lg 
                ${
                  location.pathname === "/maids"
                    ? "bg-[#e2ceaa] text-black"
                    : "hover:bg-[#e2ceaa] hover:text-black"
                }`}
            >
              <span className="text-black flex items-center gap-x-2">
                <UserRound />
                Maids
              </span>
            </Link>

            {/* Config App Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsConfigAppOpen(!isConfigAppOpen)}
                className="flex items-center gap-4 px-4 py-3 mb-3 rounded-lg w-full text-left"
              >
                <span className="text-black flex items-center gap-x-2">
                  <Cog /> Config App
                </span>
                <span
                  className={`ml-auto ${isConfigAppOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={20} />
                </span>
              </button>

              {/* Dropdown items */}
              {isConfigAppOpen && (
                <div className="pl-6">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className={`flex items-center bg-slate-100 gap-4 px-4 py-3 mb-3 rounded-lg 
                        ${
                          location.pathname === item.to
                            ? "bg-[#e2ceaa] text-black"
                            : "hover:bg-[#e2ceaa] hover:text-black"
                        }`}
                    >
                      {item.icon}
                      <span className="text-black">{item.title}</span>
                    </Link>
                  ))}

                  {/* Logout button inside dropdown */}
                </div>
              )}

              <Link
                to="/referredmaids"
                className={`flex items-center gap-4 px-4 py-3 mb-3 rounded-lg 
                ${
                  location.pathname === "/referredmaids"
                    ? "bg-[#e2ceaa] text-black"
                    : "hover:bg-[#e2ceaa] hover:text-black"
                }`}
              >
                <span className="text-black flex items-center gap-x-2">
                  <UserRoundCheck />
                  Referrals
                </span>
              </Link>

              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 mb-3 rounded-lg w-full text-left text-red-500 font-semibold "
                >
                  <LogOut size={20} />
                  <span className="">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Toggle button - visible only on mobile */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`fixed bottom-4 right-4 z-50
          p-3 rounded-full bg-blue-600 text-white
          shadow-lg hover:bg-blue-700
          lg:hidden
          ${!isCollapsed && "hidden"}`}
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default Navbar;
