import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { BACKEND_URL } from "@/app/config/config";

interface SingleProductUploadProps {
  onProductAdded: () => void; // Callback to refresh the product table
}

const SingleProductUpload: React.FC<SingleProductUploadProps> = ({
  onProductAdded,
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    imageUrls: [] as File[],
    rating: 0,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("rating", newProduct.rating.toString());

    newProduct.imageUrls.forEach((file) => {
      formData.append("images", file); // 'images' is the field name in multer
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product added successfully:", data);

        // Clear the form
        setNewProduct({
          name: "",
          price: 0,
          description: "",
          category: "",
          imageUrls: [],
          rating: 0,
        });
        setImagePreviews([]);

        onProductAdded(); // Refresh product table
      } else {
        console.log(
          "Error adding product:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.log("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        imageUrls: fileArray,
      }));
      setImagePreviews(previewUrls);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg"
    >
      {/* Input fields for product details */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          step="any"
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <input
          type="number"
          placeholder="Rating"
          value={newProduct.rating || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) })
          }
          step="any"
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Preview Section */}
      {imagePreviews.length > 0 && (
        <div className="mt-4 space-x-2 flex">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className="rounded-md border border-gray-300 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default SingleProductUpload;
