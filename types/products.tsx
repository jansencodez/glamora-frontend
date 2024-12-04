import { StaticImageData } from "next/image";

// Define a type for a product
export interface Product {
  _id: string;
  name: string;
  imageUrls: (StaticImageData | string)[]; // Array of image URLs
  price: number;
  description: string;
  category: string;
  rating: number;
  discount?: number;
  discountedPrice?: number;
}

// Deals-specific product type
export interface DealsProduct extends Product {
  discount: number; // Discount percentage (e.g., 20 means 20% off)
}

// Cart-specific data, e.g., how many of the product
export interface CartItem extends Product {
  productId: string;
  quantity: number;
}

export type ProductList = Product[];

// Shipping details for an order
export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  deliveryDate: string; // Estimated delivery date
}

// Payment details for an order
export interface PaymentDetails {
  method: string;
  status: "pending" | "completed" | "failed";
  transactionId: string;
}

// Define a type for order details
export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  discountApplied?: number;
  finalPrice: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  payment: PaymentDetails;
  shipping: ShippingDetails;
  lastUpdated: string;
  orderDate: string;
}
