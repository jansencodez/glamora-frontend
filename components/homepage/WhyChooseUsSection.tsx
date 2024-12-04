import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function WhyChooseUsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-8 text-darkGray">
          Why Choose Glamora?
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-teal-500 mb-2">
              Free Shipping Over {formatCurrency(5000)}
            </h3>
            <p className="text-gray-600">
              Enjoy free delivery on all orders over {formatCurrency(5000)}.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-teal-500 mb-2">
              Exclusive Beauty Deals
            </h3>
            <p className="text-gray-600">Find amazing discounts and bundles.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-teal-500 mb-2">
              Eco-Friendly Products
            </h3>
            <p className="text-gray-600">
              Support sustainable beauty products.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-teal-500 mb-2">About us</h3>
            <p className="text-gray-600">
              <Link
                href="/about"
                className="flex items-center text-pink-800 underline"
              >
                lean more about us, <FaArrowRight />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
