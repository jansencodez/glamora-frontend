"use client";

import { BACKEND_URL } from "@/app/config/config";
import { IUser } from "@/types/user";
import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]); // Array of IUser
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "customer">(
    "all"
  );
  const [orderFilter, setOrderFilter] = useState<
    "last7Days" | "last30Days" | "lastYear"
  >("last7Days");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading state to true when fetching starts
      try {
        const response = await fetch(`${BACKEND_URL}/api/users`); // Ensure this endpoint matches your backend
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data); // Assuming response data is the array of users
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false); // Set loading state to false once done
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find((u) => u._id === id); // Match by MongoDB _id
      if (!user) {
        throw new Error("User not found");
      }

      const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !user.active }), // Toggle active status
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === id ? { ...u, active: !u.active } : u))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.role === "admin") ||
      (filterRole === "customer" && user.role === "customer");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management">
      <h3 className="text-lg font-semibold text-gray-700">User Management</h3>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />

        {/* Role Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-4 py-2 rounded-md ${
              filterRole === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilterRole("admin")}
            className={`px-4 py-2 rounded-md ${
              filterRole === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setFilterRole("customer")}
            className={`px-4 py-2 rounded-md ${
              filterRole === "customer"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Customers
          </button>
        </div>
      </div>

      {/* Order Filter */}
      <div className="flex justify-end">
        <label htmlFor="orderFilter" className=" text-gray-700">
          Filter Orders:
        </label>
        <select
          id="orderFilter"
          value={orderFilter}
          onChange={(e) =>
            setOrderFilter(
              e.target.value as "last7Days" | "last30Days" | "lastYear"
            )
          }
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="last7Days">Last 7 Days</option>
          <option value="last30Days">Last 30 Days</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.orders.length}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      className={`px-4 py-2 text-white rounded-md ${
                        user.active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
