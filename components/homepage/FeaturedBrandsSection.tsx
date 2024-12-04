import Image from "next/image";
import b1 from "../../public/images/pomade.jpg";
import b2 from "../../public/images/4094.jpg";
import b3 from "../../public/images/coconut-lotion.jpg";
import b4 from "../../public/images/front-view-eco-friendly-products-assortment.jpg";

export default function FeaturedBrandsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-400 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-gray-700 mb-12 text-center tracking-tight">
          Shop the Best from Your Favorite Brands
        </h2>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center">
          <div className="flex justify-center hover:scale-105 transition-transform">
            <Image
              src={b1}
              alt="Brand 1"
              width={150}
              height={75}
              className="w-auto h-auto"
            />
          </div>
          <div className="flex justify-center hover:scale-105 transition-transform">
            <Image
              src={b2}
              alt="Brand 2"
              width={150}
              height={75}
              className="w-auto h-auto"
            />
          </div>
          <div className="flex justify-center hover:scale-105 transition-transform">
            <Image
              src={b3}
              alt="Brand 3"
              width={150}
              height={75}
              className="w-auto h-auto"
            />
          </div>
          <div className="flex justify-center hover:scale-105 transition-transform">
            <Image
              src={b4}
              alt="Brand 4"
              width={150}
              height={75}
              className="w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
