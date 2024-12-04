"use client";

import { useRouter } from "next/navigation";

export default function CountdownSection() {
  const router = useRouter();
  return (
    <section className="py-12 bg-gradient-to-r from-teal-600 to-cyan-500 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold tracking-tight">
          Hurry Up! Limited Time Offer
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl font-medium">
          Sale ends in:{" "}
          <span className="font-bold text-yellow-300 text-2xl">02:34:12</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/shop-deals")}
          className="bg-white text-teal-600 px-8 py-3 rounded-full shadow-lg font-semibold hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 ease-in-out"
        >
          Shop Deals
        </button>
      </div>
    </section>
  );
}
