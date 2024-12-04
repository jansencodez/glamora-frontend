"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ButtonLoader from "@/components/ButtonLoader";
import { useAuth } from "@/context/AuthContext";
import { BACKEND_URL } from "@/app/config/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter(); // For navigation after login

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(""); // Clear any previous error messages

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/signin`, {
        email,
        password,
      });

      // On successful login, store the token and redirect the user
      login(
        response.data.token,
        response.data.role,
        response.data.userId,
        response.data.user
      );
      router.push("/admin/dashboard"); // Redirect to the admin dashboard
    } catch (error: unknown) {
      if (error instanceof Error)
        setError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 main">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-pink-600 text-center mb-4">
          Admin Sign In
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome back, Admin! Please log in to continue.
        </p>

        {/* Email */}
        <label className="block text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="true"
        />

        {/* Password */}
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="true"
        />

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <Link
            href="/auth/forgot-password"
            className="text-pink-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Login Button */}
        <ButtonLoader
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
          onClick={handleSubmit}
          isLoading={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </ButtonLoader>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
