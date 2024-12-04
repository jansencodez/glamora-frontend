import React from "react";
import Image from "next/image"; // Assuming you're using Next.js
import { formatCurrency } from "@/utils/formatCurrency";
import getStars from "@/utils/getStars";
import { Product } from "@/types/products";

interface ProductTableProps {
  updatedProducts: Array<Product>;
  deleteProduct: (productId: string) => void;
  actionLoading: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  updatedProducts,
  deleteProduct,
  actionLoading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Product
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Category
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Description
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold">Price</th>
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Rating
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {updatedProducts.length > 0 ? (
            updatedProducts.map((product, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">
                  <Image
                    src={product.imageUrls[0] || ""}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <span className="ml-2">{product.name}</span>
                </td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.description}</td>
                <td className="py-2 px-4">{formatCurrency(product.price)}</td>
                <td className="py-2 px-4">
                  <div className="flex text-yellow-400">
                    {getStars(product.rating)}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => deleteProduct(product._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-6">
                No products found. Add one to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
