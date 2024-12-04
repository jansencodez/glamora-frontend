"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ButtonLoader from "./ButtonLoader";
import getStars from "@/utils/getStars";
import { useCart } from "@/context/CartContext";

// Import the Product type from types.ts
import { Product } from "@/types/products";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addItemToCart } = useCart();
  const [clicked, setClicked] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    setClicked(true);
    addItemToCart(product);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  const toggleQuickView = () => {
    if (onQuickView) {
      onQuickView();
    }
    setIsQuickViewOpen((prev) => !prev);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow max-w-xs sm:max-w-sm md:max-w-md mx-auto relative">
      <Link href={`/products/${product._id}`}>
        <div className="block">
          <div className="relative w-full h-48 sm:h-56 mb-6 overflow-hidden rounded-lg">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={400}
              height={240}
              layout="responsive"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-md sm:text-lg text-gray-600 mb-4">
            {formatCurrency(product.price)}
          </p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm sm:text-base text-gray-500">
              Category:{" "}
              <span className="font-semibold text-purple-600">
                {product.category}
              </span>
            </span>
            <div className="flex items-center">
              <span className="text-yellow-500">
                {getStars(product.rating)}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({product.rating})
              </span>
            </div>
          </div>
        </div>
      </Link>
      <ButtonLoader
        isLoading={clicked}
        onClick={handleAddToCart}
        className="w-full bg-purple-600 text-white hover:bg-purple-700 mt-4 py-3 rounded-md"
      >
        Add to Cart
      </ButtonLoader>

      {/* Quick View Button */}
      <button
        onClick={toggleQuickView}
        className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-all"
      >
        Quick View
      </button>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={toggleQuickView}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="relative w-full h-48 sm:h-56 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={product.imageUrls[currentImageIndex]} // Display current image
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  width={400}
                  height={240}
                  layout="responsive"
                  className="w-full h-full object-cover"
                />
                {product.imageUrls.length > 1 && (
                  <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
                    <button
                      onClick={handlePreviousImage}
                      className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {formatCurrency(product.price)}
              </p>
              <p className="text-gray-500 text-sm">{product.description}</p>
              <ButtonLoader
                isLoading={clicked}
                onClick={handleAddToCart}
                className="bg-purple-600 text-white hover:bg-purple-700 mt-4 py-2 px-4 rounded-md"
              >
                Add to Cart
              </ButtonLoader>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
