"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

import { Product } from "@/types/products";
import { useProducts } from "@/context/ProductsContext";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { products } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const categories = [
    "Skincare",
    "Makeup",
    "Haircare",
    "Fragrance",
    "Bath & Body",
    "Nail Care",
    "Tools & Brushes",
    "Men's Grooming",
  ];

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesQuery = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return matchesQuery && matchesCategory;
  });

  // Sorted Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Lowest Price") return a.price - b.price;
    if (sortOption === "Highest Price") return b.price - a.price;
    //if (sortOption === "Newest Arrivals")
    //return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Paginated Products
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle Category Selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Update Recently Viewed
  useEffect(() => {
    const savedViewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );
    setRecentlyViewed(savedViewed);
  }, []);

  const updateRecentlyViewed = (product: Product) => {
    const updatedViewed = [
      product,
      ...recentlyViewed.filter((p) => p._id !== product._id),
    ].slice(0, 5);
    setRecentlyViewed(updatedViewed);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedViewed));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 main">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-6 py-2 rounded-lg ${
              selectedCategories.includes(category)
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sorting Options */}
      <div className="mb-6">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Sort By</option>
          <option value="Lowest Price">Lowest Price</option>
          <option value="Highest Price">Highest Price</option>
          <option value="Newest Arrivals">Newest Arrivals</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={() => updateRecentlyViewed(product)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-4">
        {Array.from(
          { length: Math.ceil(sortedProducts.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md ${
              page === currentPage ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
