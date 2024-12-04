import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative lg:h-screen md:h-screen h-[60vh] flex items-center justify-center text-white bg-gradient-to-t from-gray-300 via-white to-gray-400 lg:bg-black md:bg-black main">
      {/* Background Image */}
      <div className="absolute inset-0 -z-1 opacity-100">
        <Image
          src="https://res.cloudinary.com/farmus/image/upload/v1733304092/image_yhwbz8.jpg"
          alt="Background"
          layout="fill"
          className="object-contain lg:object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4 leading-tight sm:text-6xl animate-fade-in">
          Welcome to <span className="text-pink-500">Glamora</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl mb-8 opacity-90 animate-fade-in delay-200">
          Discover the best beauty products tailored just for you.
        </p>

        {/* Call-to-Action Button */}
        <Link
          href="/products"
          className="inline-block bg-pink-500 hover:bg-pink-400 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg animate-fade-in delay-400"
        >
          Shop Now
        </Link>
      </div>

      {/* Scroll-Down Indicator */}
      <div className="absolute bottom-8 w-full flex justify-center animate-bounce">
        <Link
          href="#next-section"
          className="text-white text-sm flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <span>Scroll Down</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
