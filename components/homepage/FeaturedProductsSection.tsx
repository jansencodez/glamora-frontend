"use client";

import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";

export default function FeaturedProductsSection() {
  const { getFeaturedByCategory } = useProducts();
  const featured = getFeaturedByCategory("Makeup");
  console.log(featured);

  return (
    <section className="py-12 bg-lightBeige" id="next-section">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8 text-darkGray">
          Featured Products
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
