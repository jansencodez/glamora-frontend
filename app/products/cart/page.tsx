"use client";

import { useCart } from "@/context/CartContext";
import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for app directory
import Image from "next/image";
import { CartItem } from "@/types/products";
import { formatCurrency } from "@/utils/formatCurrency";

const CartPage = () => {
  const {
    fetchCart,
    cartItems,
    removeItemFromCart,
    updateItemQuantity,
    totalPrice,
  } = useCart();
  const [loading, setLoading] = useState<boolean>(false);
  const [cartLoading, setCartLoading] = useState<boolean>(false); // For cart item update loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error message handling
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (id: string, newQuantity: number): void => {
    if (newQuantity <= 0) return; // Prevent negative or zero quantities
    setCartLoading(true); // Set loading while updating
    updateItemQuantity(id, newQuantity)
      .catch((error: unknown) => {
        if (error instanceof Error) setErrorMessage(error.message);
        setErrorMessage("Failed to update quantity. Please try again.");
      })
      .finally(() => setCartLoading(false)); // Reset loading state after update
  };

  // Handle item removal from the cart
  const handleRemoveItem = (id: string): void => {
    setCartLoading(true); // Set loading while removing item
    removeItemFromCart(id)
      .catch((error: unknown) => {
        if (error instanceof Error) setErrorMessage(error.message);
        setErrorMessage("Failed to remove item. Please try again.");
      })
      .finally(() => setCartLoading(false)); // Reset loading state after removal
  };

  // Handle input change for quantity
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    const quantity = parseInt(e.target.value, 10) || 1; // Default to 1 if parsing fails
    handleQuantityChange(id, quantity);
  };

  // Handle checkout navigation
  const handleCheckout = () => {
    setLoading(true);
    router.push("/products/checkout"); // Navigate to the checkout page
  };

  return (
    <div className="container mx-auto px-4 py-8 main">
      {cartItems.length === 0 ? (
        <div>Your cart is empty!</div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

          {/* Display error message if there is any */}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <div className="space-y-4">
            {cartItems.map((item: CartItem) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 mb-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 relative">
                    <Image
                      src={item.imageUrls[0]}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p>{item.category}</p>
                    <p className="text-gray-500">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    disabled={cartLoading} // Disable buttons while loading
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, item._id)}
                    className="w-16 text-center border rounded-md"
                    min="1"
                    disabled={cartLoading} // Disable input while loading
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    disabled={cartLoading} // Disable buttons while loading
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={cartLoading} // Disable buttons while loading
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <h2 className="text-xl font-semibold mb-4 sm:mb-0">
              Total Price: {formatCurrency(totalPrice)}
            </h2>
            <button
              onClick={handleCheckout}
              disabled={loading || cartLoading} // Disable checkout while loading
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-all"
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
