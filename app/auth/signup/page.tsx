"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ButtonLoader from "@/components/ButtonLoader";
import { BACKEND_URL } from "@/app/config/config";

export default function Signup() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error messages

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        name,
        email,
        password,
        confirmPassword,
        optIn,
      });

      // On successful signup, store the token and redirect the user
      login(
        response.data.token,
        response.data.role,
        response.data.userId,
        response.data.user
      ); // Store the token
      window.location.href = "/"; // Redirect to the homepage or dashboard
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 main">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-pink-600 text-center mb-4">
          Create an Account
        </h1>
        <p className="text-gray-600 text-center mb-6">Join Glamora today!</p>

        {/* Full Name */}
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="block text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <label className="block text-gray-700 mb-2">Confirm Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:border-pink-400"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Opt-in */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
          />
          <label className="ml-2 text-gray-700 text-sm">
            I want to receive promotional emails from Glamora.
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Sign Up Button */}
        <ButtonLoader
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
          onClick={handleSubmit}
          isLoading={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </ButtonLoader>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-pink-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
