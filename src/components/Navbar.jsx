import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Availability Slots", href: "/" },
    { title: "Education Details", href: "/educationdetails" },
    { title: "Food Category", href: "/foodcategory" },
    { title: "Food Type", href: "/foodtype" },
    { title: "Gender Type", href: "/gendertype" },
    { title: "Marital Status", href: "/maritalstatus" },
    { title: "Preferred Skills", href: "/preferredskills" },
    { title: "Work Category", href: "/workcategory" },
    { title: "Preferred Languages", href: "/preferredlanguages" },
    { title: "Preferred Work Locations", href: "/preferredworklocations" },
  ];

  return (
    <div className="relative">
      {/* Mobile menu overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-[#010001] lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"}
          border-r border-gray-200
          w-64 lg:translate-x-0
          bg-[#010001]
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b ">
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
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 mb-3 rounded-lg text-white
                  ${
                    location.pathname === item.href
                      ? "bg-[#e2ceaa] text-[#010001]"
                      : "hover:bg-[#e2ceaa] hover:text-[#010001]"
                  }
                `}
              >
                <span>{item.title}</span>
              </a>
            ))}
          </div>

          {/* Logout button at bottom */}
        </nav>
      </aside>

      {/* Toggle button - visible only on mobile */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`
          fixed bottom-4 right-4 z-50
          p-3 rounded-full bg-blue-600 text-white
          shadow-lg hover:bg-blue-700
          lg:hidden
          ${!isCollapsed && "hidden"}
        `}
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default Navbar;
