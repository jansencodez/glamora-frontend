"use client";

import { useCart } from "@/context/CartContext";
import { DealsProduct } from "@/types/products";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useState } from "react";
import ButtonLoader from "../ButtonLoader";

export default function DealsProductCard({
  product,
}: {
  product: DealsProduct;
}) {
  const [clicked, setClicked] = useState(false);
  const { addItemToCart } = useCart();
  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length
    );
  };
  const handleAddToCart = () => {
    setClicked(true);
    addItemToCart(product);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 relative hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrls[currentImageIndex]} // Display the current image
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          width={400}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        {product.imageUrls.length > 1 && (
          <>
            {/* Navigation Buttons */}
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full shadow-lg"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full shadow-lg"
            >
              &gt;
            </button>
          </>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-darkGray">{product.name}</h3>
        <div className="flex items-center mt-3">
          <span className="text-red-500 font-bold text-2xl mr-2">
            {formatCurrency(discountedPrice)}
          </span>
          <span className="line-through text-gray-400 text-lg">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="text-teal-500 text-sm mt-2">Save {product.discount}%</p>
        <ButtonLoader
          isLoading={clicked}
          onClick={handleAddToCart}
          className="mt-4 bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-md font-semibold w-full transition duration-200 ease-in-out"
        >
          Add to Cart
        </ButtonLoader>
      </div>
    </div>
  );
}
