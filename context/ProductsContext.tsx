"use client";

import { BACKEND_URL } from "@/app/config/config";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product, DealsProduct } from "@/types/products";
import axios from "axios";

interface DiscountedProduct extends Product {
  discount: number;
}
interface ProductsContextType {
  products: Product[];
  deals: DealsProduct[];
  getFeaturedByCategory: (category: string) => Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setDeals: React.Dispatch<React.SetStateAction<DealsProduct[]>>;
  loading: boolean;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product | null>; // Fixed return type
  fetchDeals: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<DealsProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const createProduct = async (
    productData: FormData
  ): Promise<Product | null> => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/api/products`,
        productData
      );

      if (response.status === 200) {
        const newProduct: DiscountedProduct = response.data;

        // Calculate discounted price if discount exists
        const discountedPrice = newProduct.discount
          ? newProduct.price - (newProduct.price * newProduct.discount) / 100
          : newProduct.price;

        const productWithDiscount = { ...newProduct, discountedPrice };

        setProducts((prevProducts) => [productWithDiscount, ...prevProducts]);
        return productWithDiscount;
      } else {
        console.log("Error creating product:", response.data);
      }
    } catch (error) {
      console.log("Error creating product:", error);
      throw error;
    } finally {
      setLoading(false);
    }

    return null;
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      setLoading(true);

      // Use axios to send a DELETE request
      const response = await axios.delete(
        `${BACKEND_URL}/api/products/${productId}`
      );

      if (response.status === 200) {
        // Remove the product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.log("Error deleting product:", response.data);
      }
    } catch (error) {
      console.log("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async (page = 1, limit = 10): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BACKEND_URL}/api/products?page=${page}&limit=${limit}`
      );

      if (response.status === 200) {
        const data = response.data;
        setProducts(data.products);
        console.log(data);
      } else {
        console.log("Failed to fetch products, using dummy data.");
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/deals`);

      if (response.status === 200) {
        const data = response.data;
        setDeals(data.deals);
      } else {
        console.log("Failed to fetch deals, using dummy data.");
      }
    } catch (error) {
      console.log("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedByCategory = (category: string): Product[] =>
    products.filter(
      (product) => product.rating >= 3.5 && product.category === category
    );

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        deals,
        getFeaturedByCategory,
        setProducts,
        setDeals,
        loading,
        deleteProduct,
        fetchProducts,
        fetchDeals,
        createProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
