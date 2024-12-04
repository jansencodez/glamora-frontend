"use client";

import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import rootUrl from "@/app/root-url/url";
import { useAuth } from "@/context/AuthContext";

function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
  });
  const { totalPrice, finalPrice, deliveryDate } = useCart();
  const { user, token } = useAuth(); // Assuming this provides user info

  // Handle payment method change
  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  // Handle shipping address change
  const handleShippingAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle placing the order and initializing payment
  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      // Prepare the order details
      const { fullName, address, phone, country, city, postalCode } =
        shippingAddress;
      const orderDetails = {
        shippingAddress: {
          fullName,
          address,
          phone,
          country,
          city,
          postalCode,
        },
        paymentMethod,
        totalPrice,
        finalPrice,
        deliveryDate,
      };

      if (user) {
        const orderResponse = await axios.post(
          `${rootUrl}/api/payment/initialize-payment`,
          {
            email: user.email, // Pass email from user context
            amount: finalPrice, // Amount for the transaction (final price)
            ...orderDetails, // Include order details in the body
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in the Authorization header
            },
          }
        );

        if (orderResponse.status === 200) {
          const { authorization_url, orderId } = orderResponse.data;

          // Store orderId in localStorage
          localStorage.setItem("orderId", orderId);

          // Construct the final redirection URL with the callback URL
          const redirectUrl = `${authorization_url}`;
          window.location.href = redirectUrl;
        } else {
          alert("Payment initialization failed.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Checkout</h2>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={shippingAddress.phone}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleShippingAddressChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option value="mpesa">M-Pesa</option>
          <option value="paystack">Paystack</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <p className="mb-1">Total Price: KES {totalPrice}</p>
        <p className="mb-1">Discounted Price: KES {finalPrice}</p>
        <p>Delivery Date: {deliveryDate}</p>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-center">
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="bg-blue-600 text-white py-3 px-6 rounded-md disabled:opacity-50"
        >
          {isLoading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
