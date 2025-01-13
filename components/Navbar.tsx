"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import logo from "../public/images/logo/logo.png";
import { useAuth } from "@/context/AuthContext";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    setLoading(true);
    logout();
    setLoading(false);
  };

  return (
    <nav
      className="relative bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 p-4 shadow-lg z-50"
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 80 40%27 width=%27100%25%27 height=%27100%25%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.15%27%3E%3Ccircle r=%2716%27 cx=%270%27 cy=%270%27/%3E%3Ccircle r=%2716%27 cx=%2740%27 cy=%2718%27/%3E%3Ccircle r=%2716%27 cx=%2780%27 cy=%270%27/%3E%3C/g%3E%3C/svg%3E')",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Home"
        >
          <Image
            src={logo}
            alt="Glamora Logo"
            height={50}
            width={50}
            priority
            className="rounded-full border-2 border-white shadow-md"
          />
          <span className="text-white text-2xl font-bold tracking-wide">
            <b className="text-red-200">Glamora</b> Beauty
          </span>
        </Link>

        {/* Links for Large Screens */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link
            href="/profile"
            className="text-white flex justify-center items-center hover:text-pink-200 transition"
            aria-label="Profile"
          >
            <FaUser />
          </Link>
          <Link
            href="/products"
            className="text-white hover:text-pink-200 transition"
          >
            Products
          </Link>
          <Link
            href="/products/cart"
            className="text-white relative hover:text-pink-200 transition"
            aria-label="Cart"
          >
            <FaShoppingCart className="text-xl" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs -mt-2 -mr-2">
                {itemCount}
              </span>
            )}
          </Link>
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              className="text-white hover:text-pink-200 transition"
            >
              Login
            </Link>
          ) : (
            <ButtonLoader
              isLoading={loading}
              onClick={handleLogout}
              className="text-white hover:text-pink-200 transition"
            >
              Logout
            </ButtonLoader>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-3xl"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-pink-600 bg-opacity-95 z-40 p-8 flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className="text-white flex items-center hover:text-pink-200 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUser className="mr-2" /> Profile
          </Link>
          <Link
            href="/products"
            className="text-white hover:text-pink-200 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          {isLoggedIn && (
            <Link
              href="/products/cart"
              className="text-white hover:text-pink-200 transition relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="mr-2 text-xl" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs -mt-2 -mr-2">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              className="text-white hover:text-pink-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <ButtonLoader
              isLoading={loading}
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-pink-200 transition"
            >
              Logout
            </ButtonLoader>
          )}
        </div>
      )}
    </nav>
  );
}
