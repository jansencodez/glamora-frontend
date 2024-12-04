"use client";

import DealsProductCard from "@/components/shop-deals/DealsProductCard";
import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/types/products";

interface DealsProduct extends Product {
  discount: number;
}

export default function ShopDeals() {
  // Filter products with discounts
  const { products } = useProducts();
  const deals = products.filter(
    (product) => (product as DealsProduct).discount > 0
  );

  return (
    <div className="min-h-screen bg-lightBeige py-12 main">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-darkGray mb-12 text-center">
          Hot Deals 🔥
        </h1>

        {/* Deal grid section */}
        {deals.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {deals.map((product) => (
              <DealsProductCard
                key={product._id}
                product={product as DealsProduct}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No deals available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
