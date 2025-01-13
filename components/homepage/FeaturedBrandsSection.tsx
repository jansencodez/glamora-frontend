import Image from "next/image";
import b1 from "../../public/images/pomade.jpg";
import b2 from "../../public/images/4094.jpg";
import b3 from "../../public/images/coconut-lotion.jpg";
import b4 from "../../public/images/front-view-eco-friendly-products-assortment.jpg";

export default function FeaturedBrandsSection() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-300 to-white overflow-hidden">
      {/* SVG Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,128L48,144C96,160,192,192,288,218.7C384,245,480,267,576,234.7C672,203,768,117,864,80C960,43,1056,53,1152,96C1248,139,1344,213,1392,250.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-gray-700 mb-12 text-center tracking-tight drop-shadow-md">
          Shop the Best from Your Favorite Brands
        </h2>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center">
          {[b1, b2, b3, b4].map((brand, idx) => (
            <div
              key={idx}
              className="flex justify-center hover:scale-110 transition-transform duration-300 ease-in-out"
            >
              <Image
                src={brand}
                alt={`Brand ${idx + 1}`}
                width={200}
                height={100}
                className="w-auto h-auto rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
