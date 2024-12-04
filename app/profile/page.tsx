"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext"; // Assuming you have CartContext
import Link from "next/link"; // Or any navigation library you are using
import { BACKEND_URL } from "@/app/config/config";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: string;
  imageUrls: string[];
}

interface PaymentDetails {
  method: string;
  status: string;
  transactionId?: string;
}

interface ShippingDetails {
  fullName: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
}

interface Order {
  orderId: string;
  status: string;
  totalPrice: number;
  finalPrice: number;
  discountApplied: number;
  payment: PaymentDetails;
  shipping: ShippingDetails;
  items: CartItem[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  orders: Order[];
}

const CustomerDashboard: React.FC = () => {
  const { cartItems, totalPrice, finalPrice, fetchCart } = useCart(); // Get cart data from Cart context
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // User profile data
  const [orders, setOrders] = useState<Order[]>([]); // Orders data
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
    if (token && role !== "customer") {
      router.push("/not-authorized");
    }
  }, [role, token, router]);

  // Fetch user profile and orders
  useEffect(() => {
    if (!token) return; // Avoid fetching if there's no token

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData.user); // Set the user data
          setOrders(profileData.orders); // Set the orders from the profile response
        } else {
          console.log("Failed to fetch user profile");
        }
      } catch (error) {
        console.log("Error fetching user profile", error);
      }
    };

    fetchUserData();
    fetchCart(); // Fetch cart data when the component mounts
  }, [token, fetchCart]);

  console.log("Orders:", orders);
  console.log("User:", userProfile);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 main">
      <h1 className="text-3xl font-semibold text-gray-800">
        Welcome back, {userProfile?.name || "Customer"}!
      </h1>

      {/* Profile Overview */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Overview
        </h2>
        <p className="text-gray-600">Email: {userProfile?.email}</p>
        <p className="text-gray-600">Role: {userProfile?.role}</p>
        {/* Add more profile details here */}
      </section>

      {/* Cart Summary */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Cart Summary
        </h2>
        <p className="text-gray-600">Total Items: {cartItems.length}</p>
        <p className="text-gray-600">
          Total Price: {formatCurrency(totalPrice)}
        </p>
        <p className="text-gray-600">
          Final Price: {formatCurrency(finalPrice)}
        </p>
        <div className="mt-4">
          <Link href="/products/cart">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
              Go to Cart
            </button>
          </Link>
        </div>
      </section>

      {/* Order History */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Order History
        </h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order: Order) => (
              <li
                key={order.orderId}
                className="p-4 border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <p className="text-gray-800 font-semibold">
                  Order ID: {order.orderId}
                </p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">
                  Total Price: {formatCurrency(order.totalPrice)}
                </p>
                <p className="text-gray-600">
                  Final Price: {formatCurrency(order.finalPrice)}
                </p>
                <Link href={`/orders/${order.orderId}`}>
                  <button className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300">
                    View Order
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Account Settings */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Account Settings
        </h2>
        <Link href="/settings">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
            Edit Account
          </button>
        </Link>
      </section>
    </div>
  );
};

export default CustomerDashboard;
