"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/formatCurrency";
import rootUrl from "@/app/root-url/url";

// Define types for order details, items, and shipping/payment details
type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrls: string[];
};

// Represents an individual item in the order
type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
  name: string;
  category: string;
  price: number;
};

// Represents the entire order
type OrderDetails = {
  _id: string;
  orderId: string;
  items: CartItem[];
  status: string;
  totalPrice: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  shipping: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    deliveryDate: string; // ISO date string
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch orders on component mount
  useEffect(() => {
    const getOrders = async () => {
      try {
        console.log("Token:", token); // Log the token to verify it's being passed

        const response = await fetch(`${rootUrl}/api/order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token here
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error:", errorData); // Log the error details
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log(data);

        // Ensure that the data is an array before setting the state
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.log("Expected an array, but received:", data);
          setError("Invalid data format received from the server");
        }
      } catch (error) {
        console.log("Fetch error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    getOrders();
  }, [token]);

  const handleStatusChange = (orderId: string, status: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="order-management max-w-6xl mx-auto p-6">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">All Orders</h3>

      {/* Loading state */}
      {isLoading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : orders.length === 0 ? (
        <p>No orders available</p> // Handle case where no orders are available
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border-separate border-spacing-2 shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Total Price
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {order.orderId}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2"
                      >
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-500">
                    {order.status}
                  </td>
                  <td className="py-2 px-4">
                    <select
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      value={order.status}
                      className="py-1 px-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
