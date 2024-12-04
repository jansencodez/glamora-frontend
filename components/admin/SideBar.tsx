import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaTag,
  FaChartBar,
} from "react-icons/fa";

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Toggle button for small screens */}
      <button
        className="lg:hidden bg-gray-800 text-white p-3 fixed top-4 left-4 z-50 rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } main lg:translate-x-0 transform fixed top-0 left-0 bg-gray-800 text-white w-64 h-full p-4 z-40 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaBox className="mr-2" /> Admin Menu
        </h2>
        <ul>
          <li>
            <button
              className="w-full flex items-center text-left p-2 hover:bg-gray-700"
              onClick={() => {
                setActiveSection("productManagement");
                setIsSidebarOpen(false);
              }}
            >
              <FaBox className="mr-2" /> Product Management
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center text-left p-2 hover:bg-gray-700"
              onClick={() => {
                setActiveSection("userManagement");
                setIsSidebarOpen(false);
              }}
            >
              <FaUsers className="mr-2" /> User Management
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center text-left p-2 hover:bg-gray-700"
              onClick={() => {
                setActiveSection("orderManagement");
                setIsSidebarOpen(false);
              }}
            >
              <FaShoppingCart className="mr-2" /> Order Management
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center text-left p-2 hover:bg-gray-700"
              onClick={() => {
                setActiveSection("discountManagement");
                setIsSidebarOpen(false);
              }}
            >
              <FaTag className="mr-2" /> Discount Management
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center text-left p-2 hover:bg-gray-700"
              onClick={() => {
                setActiveSection("analytics");
                setIsSidebarOpen(false);
              }}
            >
              <FaChartBar className="mr-2" /> Analytics
            </button>
          </li>
        </ul>
      </div>

      {/* Backdrop for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
