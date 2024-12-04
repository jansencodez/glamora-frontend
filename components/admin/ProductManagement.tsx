"use client";

import React, { useState } from "react";
import SingleProductUpload from "./uploads/SingleUploads";
import BulkProductUpload from "./uploads/BulkUploads";
import ProductTable from "./ProductsTable"; // Assuming you have a ProductTable component
import { useProducts } from "@/context/ProductsContext";

const ProductManagement: React.FC = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const { products, loading, fetchProducts, deleteProduct } = useProducts();

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleProductRemoved = (id: string) => {
    deleteProduct(id);
  };

  const handleBulkUpload = () => {
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-0 p-1 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Product Management
      </h2>

      {/* Toggle buttons for Single/Bulk Upload */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShowBulkUpload(false)}
          className={`py-2 px-4 rounded-lg text-white ${
            !showBulkUpload ? "bg-blue-500" : "bg-gray-400"
          } hover:bg-blue-600`}
        >
          Single Upload
        </button>
        <button
          onClick={() => setShowBulkUpload(true)}
          className={`py-2 px-4 rounded-lg text-white ${
            showBulkUpload ? "bg-blue-500" : "bg-gray-400"
          } hover:bg-blue-600`}
        >
          Bulk Upload
        </button>
      </div>

      {/* Conditionally render Single or Bulk Upload */}
      <div className="mb-6">
        {showBulkUpload ? (
          <BulkProductUpload onBulkUpload={handleBulkUpload} />
        ) : (
          <SingleProductUpload onProductAdded={handleProductAdded} />
        )}
      </div>

      {/* Product Table */}
      <div className="mt-8">
        <ProductTable
          updatedProducts={products}
          deleteProduct={handleProductRemoved}
          actionLoading={loading}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
