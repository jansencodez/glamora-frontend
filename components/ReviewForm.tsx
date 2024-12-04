"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import ButtonLoader from "./ButtonLoader";
import { BACKEND_URL } from "@/app/config/config";

const ReviewForm = ({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void; // Callback to close the modal
}) => {
  const [rating, setRating] = useState<number>(0); // Store selected rating
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Store hover state
  const [reviewText, setReviewText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken ?? "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading
    try {
      const res = await fetch(`${BACKEND_URL}}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, rating, text: reviewText }),
      });

      if (res.ok) {
        console.log("Review submitted!");
        onClose(); // Close modal on success
      } else {
        console.log("Error submitting review");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Overlay to close the modal */}
      <div
        className="absolute inset-0 z-0"
        onClick={onClose}
        aria-label="Close modal"
      ></div>

      {/* Modal content */}
      <div
        className="bg-white rounded-lg p-6 shadow-lg z-10 w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>

        {/* Rating Section */}
        <div className="rating flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-3xl transition ${
                star <= (hoverRating ?? rating)
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(star)} // Set the rating
              title={`${star} Star${star > 1 ? "s" : ""}`} // Tooltip
            />
          ))}
        </div>

        {rating > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            You selected {rating} star{rating > 1 ? "s" : ""}.
          </p>
        )}

        {/* Review Text */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-2 border rounded-md mb-4"
          rows={4}
        ></textarea>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <ButtonLoader
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
              !rating || !reviewText ? "opacity-50 cursor-not-allowed" : ""
            }`}
            isLoading={loading}
          >
            Submit Review
          </ButtonLoader>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
