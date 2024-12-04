import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import rootUrl from "@/app/root-url/url";

type Product = {
  name: string;
  category: string;
  price: number;
  description: string;
  rating: number;
  imageUrls: string[]; // Array of image URLs
};

type BulkProductUploadProps = {
  onBulkUpload: () => void; // Callback function to notify when bulk upload is successful
};

const BulkProductUpload: React.FC<BulkProductUploadProps> = ({
  onBulkUpload,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      addToast("No file selected", "error");
      return;
    }

    const fileType = selectedFile.type;
    if (fileType !== "text/csv") {
      addToast("Unsupported file format", "error");
      return;
    }

    parseFile(selectedFile);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url); // Check if the URL is absolute
      return true;
    } catch (e: unknown) {
      console.log(e);
      return url.startsWith("/images"); // Check if it's a relative path
    }
  };

  const downloadImage = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split("/").pop() || "image";
    return new File([blob], filename, { type: blob.type });
  };

  const parseFile = async (file: File): Promise<void> => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const parsedProducts: Product[] = (
          result.data as { [key: string]: string }[]
        ).map((value) => {
          const imageUrls = value.imageUrls
            ? value.imageUrls
                .split(",")
                .map((url) => url.trim())
                .filter((url) => isValidUrl(url)) // Filter invalid URLs
            : [];

          return {
            name: value.name || "",
            category: value.category || "",
            price: !isNaN(parseFloat(value.price))
              ? parseFloat(value.price)
              : 0,
            description: value.description || "",
            rating: !isNaN(parseFloat(value.rating))
              ? parseFloat(value.rating)
              : 0,
            imageUrls,
          };
        });

        setProducts(parsedProducts);
      },
      error: () => {
        addToast("Error parsing CSV", "error");
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (products.length === 0) {
      addToast("No products to upload", "error");
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Add products to FormData
      formData.append("products", JSON.stringify(products));

      // For each product, download the images and append them to FormData
      for (const product of products) {
        for (const url of product.imageUrls) {
          if (!isValidUrl(url)) continue;

          const imageFile = await downloadImage(url);
          formData.append("images", imageFile);
        }
      }

      const response = await fetch(`${rootUrl}/api/products/bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast(errorData.message || "Failed to upload products", "error");
        return;
      }

      addToast("Products uploaded successfully", "success");
      onBulkUpload();
      setProducts([]);
    } catch {
      addToast("An error occurred while uploading", "error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload File (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading || products.length === 0}
          className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Bulk Products"}
        </button>
      </form>

      {products.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Product Name
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Category
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Price
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Description
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Rating
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-left">
                  Images
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 text-sm">{product.name}</td>
                  <td className="py-2 px-4 text-sm">{product.category}</td>
                  <td className="py-2 px-4 text-sm">${product.price}</td>
                  <td className="py-2 px-4 text-sm">{product.description}</td>
                  <td className="py-2 px-4 text-sm">{product.rating}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2 flex-wrap">
                      {product.imageUrls.length > 0 ? (
                        product.imageUrls.map((url, idx) => (
                          <div key={idx} className="image-container">
                            {/* Handle relative image URLs */}
                            <Image
                              src={url} // Prepend /images for relative URLs
                              alt={product.name}
                              width={200}
                              height={200}
                              layout="intrinsic"
                            />
                          </div>
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkProductUpload;
