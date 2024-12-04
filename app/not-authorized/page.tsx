"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NotAuthorized = () => {
  const router = useRouter();

  // Redirect to home or login page after a few seconds (optional)
  useEffect(() => {
    setTimeout(() => {
      router.push("/"); // Redirect to home or login page
    }, 5000); // Redirect after 5 seconds
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          You are not authorized to view this page.
        </p>
        <p className="text-lg text-gray-500">
          You will be redirected to the homepage shortly.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
