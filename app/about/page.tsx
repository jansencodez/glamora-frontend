import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 main">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-pink-500 text-center mb-8">
          About Glamora
        </h1>
        <p className="text-lg leading-relaxed text-center mb-8">
          Welcome to{" "}
          <span className="font-semibold text-pink-600">Glamora</span>, your
          one-stop destination for all things beauty and wellness. We are
          dedicated to providing top-quality beauty products that help you shine
          with confidence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed">
              At Glamora, we believe beauty is more than skin deep. Our mission
              is to empower you with products that are not only effective but
              also ethically sourced and sustainable. We aim to bring the best
              of beauty to your doorstep while caring for the planet.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
            Why Choose Us?
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="bg-pink-500 text-white rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              <p>High-quality, curated beauty products.</p>
            </li>
            <li className="flex items-center">
              <span className="bg-pink-500 text-white rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              <p>Commitment to sustainability and ethical practices.</p>
            </li>
            <li className="flex items-center">
              <span className="bg-pink-500 text-white rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              <p>Seamless shopping experience on all devices.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
