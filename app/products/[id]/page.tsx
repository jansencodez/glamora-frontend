"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext"; // Import the Cart context
import ReviewsSection from "@/components/ReviewsSection";
import ButtonLoader from "@/components/ButtonLoader"; // Assuming ButtonLoader is used for button loading states
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import getStars from "@/utils/getStars";
import { useProducts } from "@/context/ProductsContext";

const ProductDetails = () => {
  const { id } = useParams(); // Retrieve the id from the URL
  const { addItemToCart } = useCart();
  const [clicked, setClicked] = useState(false);
  const { products } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the index of the current image being viewed

  // Ensure the id exists and is a number before proceeding
  if (!id) return <div>Loading...</div>;

  // Find the product with the matching id
  const product = products.find((item) => item._id === id);

  // If the product is not found, return an error message
  if (!product) {
    return <div>Product not found.</div>;
  }

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    if (product) {
      setClicked(true); // Set clicked to true when the button is clicked
      addItemToCart(product); // Add product to cart
      setTimeout(() => {
        setClicked(false); // Reset button state after 2 seconds
      }, 2000);
    }
  };

  // Ensure imageUrl array exists and is not empty
  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : ["/fallback-image.jpg"]; // Fallback image in case of missing images

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 main">
      <div className="flex flex-col md:flex-row items-center ">
        {/* Image Gallery (Carousel) */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 relative flex justify-center">
          <Image
            src={images[currentImageIndex]}
            alt={product.name}
            width={500} // Adjust width and height as needed
            height={500}
            className="object-cover rounded-lg"
          />
          <div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-black cursor-pointer"
            onClick={handlePreviousImage}
          >
            <FaArrowLeft />
          </div>
          <div
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-black cursor-pointer"
            onClick={handleNextImage}
          >
            <FaArrowRight />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 md:pl-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {formatCurrency(product.price)}
          </p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-800 mb-4">Category: {product.category}</p>
          <div className="text-yellow-500 mb-4">{getStars(product.rating)}</div>

          {/* Add to Cart Button */}
          <ButtonLoader
            isLoading={clicked}
            onClick={handleAddToCart}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-all"
          >
            Add to Cart
          </ButtonLoader>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection productId={product._id} />
    </div>
  );
};

export default ProductDetails;
