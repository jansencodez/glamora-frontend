import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function WhyChooseUsSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-800">
          Why Choose Glamora?
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              Free Shipping Over {formatCurrency(5000)}
            </h3>
            <p className="text-gray-700">
              Enjoy free delivery on all orders over {formatCurrency(5000)}.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              Exclusive Beauty Deals
            </h3>
            <p className="text-gray-700">
              Find amazing discounts and bundles on top products.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              Eco-Friendly Products
            </h3>
            <p className="text-gray-700">
              Support sustainable beauty choices with our eco-friendly line.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              About Us
            </h3>
            <p className="text-gray-700">
              <Link
                href="/about"
                className="inline-flex items-center text-pink-600 underline hover:text-pink-800"
              >
                Learn more about us
                <FaArrowRight className="ml-2" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
