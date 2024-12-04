"use client";

import { useState, useEffect, useCallback } from "react";
import Analytics from "@/components/admin/Analytics";
import DiscountManagement from "@/components/admin/DiscountManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import UserManagement from "@/components/admin/UserManagement";
import Sidebar from "@/components/admin/SideBar";
import { AdminData } from "@/types/admin";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/app/config/config";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("productManagement");
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    setRole(storedRole ?? "");
    setToken(storedToken ?? "");
  }, []);

  // Only push to "not-authorized" page when the role or token is missing or invalid
  useEffect(() => {
    if (token && role !== "admin") {
      router.push("/not-authorized");
    }
  }, [role, token, router]);

  const fetchAdminData = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: AdminData = await response.json();
        setAdminData(data);
      } else {
        console.log("Error fetching admin data");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]); // The function will only re-run when `token` changes

  useEffect(() => {
    if (token && role === "admin") {
      fetchAdminData();
    }
  }, [token, role, fetchAdminData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen main m-0">
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 m-0 my-auto lg:ml-64 p-2 ">
        <h1 className="text-4xl font-semibold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Display Admin Data */}
        {adminData && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Admin Overview
            </h2>
            <p className="text-gray-700">Total Users: {adminData.totalUsers}</p>
            <p className="text-gray-700">
              Total Orders: {adminData.totalOrders}
            </p>
            <p className="text-gray-700">
              Total Products: {adminData.totalProducts}
            </p>
            <p className="text-gray-700">
              Total Revenue: {formatCurrency(adminData.totalRevenue)}
            </p>
          </div>
        )}

        {/* Conditionally Render Sections */}
        {activeSection === "productManagement" && (
          <section className="bg-white p-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Management
            </h2>
            <ProductManagement />
          </section>
        )}

        {activeSection === "userManagement" && (
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User Management
            </h2>
            <UserManagement />
          </section>
        )}

        {activeSection === "orderManagement" && (
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Management
            </h2>
            <OrderManagement />
          </section>
        )}

        {activeSection === "discountManagement" && (
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Discount Management
            </h2>
            <DiscountManagement />
          </section>
        )}

        {activeSection === "analytics" && (
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics
            </h2>
            <Analytics />
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
