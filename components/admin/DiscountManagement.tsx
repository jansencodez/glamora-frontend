"use client";

import { BACKEND_URL } from "@/app/config/config";
import { Product } from "@/types/products";
import React, { useState, useEffect } from "react";

// Assuming you are using fetch to interact with the backend
interface DiscountedProduct extends Product {
  discount: number;
}

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState<DiscountedProduct[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    discount: 0,
    productId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`); // Adjust this to your backend endpoint
      const data = await response.json();
      if (data.success) {
        setDiscounts(data.products); // Assuming the response contains the product data
      } else {
        alert("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Call fetchProducts on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding or updating a discount
  const handleAddDiscount = async () => {
    if (newDiscount.discount > 0 && newDiscount.productId) {
      const updatedProduct = {
        discount: newDiscount.discount,
      };

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/products/${newDiscount.productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        );
        const data = await response.json();
        if (data.success) {
          // Update the discount list with the modified product
          setDiscounts(
            discounts.map((product) =>
              product._id === newDiscount.productId
                ? { ...product, discount: newDiscount.discount }
                : product
            )
          );
          setNewDiscount({ discount: 0, productId: "" });
          setIsEditing(false);
        } else {
          alert("Failed to update discount");
        }
      } catch (error) {
        console.error("Error updating discount:", error);
      }
    } else {
      alert("Please provide a valid discount percentage");
    }
  };

  // Handle editing a discount
  const handleEditDiscount = (productId: string, currentDiscount: number) => {
    setNewDiscount({ discount: currentDiscount, productId });
    setIsEditing(true);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setNewDiscount({ discount: 0, productId: "" });
    setIsEditing(false);
  };

  // Filter products based on the search term
  const filteredDiscounts = discounts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="discount-management">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Manage Discounts
      </h3>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name"
          className="border p-2 rounded-md w-full mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
        />
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Discount Percentage"
          className="border p-2 rounded-md w-full mb-2"
          value={newDiscount.discount}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, discount: Number(e.target.value) })
          }
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddDiscount}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {isEditing ? "Update Discount" : "Add Discount"}
          </button>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <h4 className="text-md font-semibold text-gray-700 mb-3">
        Active Discounts
      </h4>

      {/* Display filtered list based on the search term */}
      <div className="discount-list space-y-4">
        {filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div>
                <p className="text-gray-700">{product.name}</p>
                <p className="text-green-500">{product.discount}% OFF</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    handleEditDiscount(product._id, product.discount)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;
