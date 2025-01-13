"use client";

import { useRouter } from "next/navigation";

export default function CountdownSection() {
  const router = useRouter();
  return (
    <section className="py-12 bg-gradient-to-r from-teal-600 to-cyan-500 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-6 relative z-10">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Hurry Up! Limited Time Offer
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl font-medium drop-shadow-md">
          Sale ends in:{" "}
          <span className="font-bold text-yellow-300 text-3xl md:text-4xl">
            02:34:12
          </span>
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/shop-deals")}
          className="bg-white text-teal-600 px-8 py-3 rounded-full shadow-lg font-semibold hover:bg-yellow-300 hover:text-teal-900 hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          Shop Deals
        </button>
      </div>

      {/* Optional Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M0,160L30,186.7C60,213,120,267,180,256C240,245,300,171,360,144C420,117,480,139,540,170.7C600,203,660,245,720,229.3C780,213,840,139,900,96C960,53,1020,43,1080,80C1140,117,1200,203,1260,224C1320,245,1380,203,1410,181.3L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
}
