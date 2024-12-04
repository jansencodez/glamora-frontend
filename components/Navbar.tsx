"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Import useCart hook
import { FaShoppingCart, FaUser } from "react-icons/fa"; // Import shopping cart icon from react-icons
import { HiMenu, HiX } from "react-icons/hi"; // Import hamburger and close icons
import Image from "next/image";
import logo from "../public/images/logo/logo.png";
import { useAuth } from "@/context/AuthContext";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
  const { cartItems } = useCart(); // Get the cart items from the context
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Count the total items in the cart
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle mobile menu toggle
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    setLoading(true);
    logout();
    setLoading(false);
  };

  return (
    <nav className="bg-pink-500 p-4 shadow-md fixed w-full top-0 left-0 z-50 lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:shadow-none h-24">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="logo"
            height={50}
            width={50}
            priority
            className="rounded-full border-2 border-white shadow-md"
          />
          <span className="text-white text-2xl font-extrabold tracking-wide">
            <b className="text-red-200">Glamora</b> Beauty
          </span>
        </Link>

        {/* Links section for larger screens */}
        <div className="lg:flex lg:space-x-6 lg:ml-auto hidden lg:flex-row">
          {/*profile link*/}
          <Link
            href="/profile"
            className="text-white text-lg hover:text-pink-200 transition-colors py-3 px-4 w-full flex justify-center items-center outline-4 outline outline-pink-200 rounded-full"
          >
            <FaUser />
          </Link>
          {/* Products Link */}
          <Link
            href="/products"
            className="text-white text-lg hover:text-pink-200 transition-colors flex justify-center items-center"
          >
            Products
          </Link>

          {/* Cart Link */}
          <Link
            href="/products/cart"
            className="text-white text-lg flex items-center relative hover:text-pink-200 transition-colors"
          >
            <FaShoppingCart className="mr-2 text-xl" />
            {itemCount > 0 && ( // Display the item count only if it's greater than 0
              <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs -mt-2 -mr-2">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Conditionally Render Login/Logout Link */}
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              className="text-white text-lg hover:text-pink-200 transition-colors"
            >
              Login
            </Link>
          ) : (
            <ButtonLoader
              isLoading={loading}
              onClick={handleLogout}
              className="text-white text-lg bg-transparent transition-colors py-3 px-4 w-full text-center"
            >
              Logout
            </ButtonLoader>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-3xl"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* Cart Link visible alongside menu on small screens */}
          {isLoggedIn && (
            <Link
              href="/products/cart"
              className="text-white text-lg flex items-center relative hover:text-pink-200 transition-colors"
            >
              <FaShoppingCart className="mr-2 text-xl" />
              {itemCount > 0 && ( // Display the item count only if it's greater than 0
                <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs -mt-2 -mr-2">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Sidebar Menu for Mobile */}
      <div
        className={`${
          isMenuOpen ? "left-0" : "-left-full"
        } lg:hidden fixed top-0 bottom-0 w-2/5 bg-pink-600 bg-opacity-95 transition-all duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white text-3xl"
          >
            <HiX />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-16">
          {/* Products Link */}
          <Link
            href="/profile"
            className="text-white text-lg hover:text-pink-200 transition-colors py-3 px-4 w-full text-center flex justify-center"
          >
            <FaUser />
          </Link>

          <Link
            href="/products"
            className="text-white text-lg hover:text-pink-200 transition-colors py-3 px-4 w-full text-center"
          >
            Products
          </Link>

          {/* Cart Link */}
          {isLoggedIn && (
            <Link
              href="/products/cart"
              className="text-white text-lg flex items-center justify-center relative hover:text-pink-200 transition-colors py-3 px-4 w-full text-center"
            >
              <FaShoppingCart className="mr-2 text-xl" />
              {itemCount > 0 && ( // Display the item count only if it's greater than 0
                <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs -mt-2 -mr-2">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Conditionally Render Login/Logout Link */}
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              className="text-white text-lg hover:text-pink-200 transition-colors py-3 px-4 w-full text-center"
            >
              Login
            </Link>
          ) : (
            <ButtonLoader
              isLoading={loading}
              onClick={handleLogout}
              className="text-white text-lg bg-transparent transition-colors py-3 px-4 w-full text-center"
            >
              Logout
            </ButtonLoader>
          )}
        </div>
      </div>
    </nav>
  );
}
