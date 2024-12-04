"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { CartItem, Product } from "@/types/products";
import { useAuth } from "./AuthContext";
import { BACKEND_URL } from "@/app/config/config";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  finalPrice: number;
  deliveryDate: string;
  addItemToCart: (product: Product) => void;
  removeItemFromCart: (id: string) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { token } = useAuth();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  const API_BASE_URL = `${BACKEND_URL}/api/cart`;

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        calculatePrice(data.items || []);
      } else {
        console.log("Failed to fetch cart", await response.json());
      }
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  }, [token, API_BASE_URL]);

  const addItemToCart = async (product: Product) => {
    try {
      const discountedPrice =
        product.discount !== undefined && product.discount > 0
          ? product.price - (product.price * product.discount) / 100
          : product.price;
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1, // Assuming you add 1 item at a time
          name: product.name,
          price: discountedPrice, // Use discounted price here
          imageUrls: product.imageUrls,
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculatePrice(updatedCart.items);
      } else {
        console.log("Failed to add item to cart", await response.json());
      }
    } catch (error) {
      console.log("Error adding item to cart:", error);
    }
  };

  const removeItemFromCart = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculatePrice(updatedCart.items);
      } else {
        console.log("Failed to remove item from cart", await response.json());
      }
    } catch (error) {
      console.log("Error removing item from cart:", error);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      console.log("Quantity must be greater than 0.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculatePrice(updatedCart.items);
      } else {
        console.log("Failed to update item quantity", await response.json());
      }
    } catch (error) {
      console.log("Error updating item quantity:", error);
    }
  };

  const calculatePrice = (items: CartItem[]) => {
    const calculatedTotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(calculatedTotal);

    // Assuming final price calculation could include discounts or taxes
    const calculatedFinalPrice = calculatedTotal; // Add discount logic here if needed
    setFinalPrice(calculatedFinalPrice);

    // Set delivery date (you can calculate it based on business logic)
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + 2)); // Example: 2 days from today
    setDeliveryDate(nextDay.toLocaleDateString());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        finalPrice,
        deliveryDate,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
