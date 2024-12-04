"use client";

import { useCallback, useEffect, useState } from "react";
import { FaStar, FaEdit } from "react-icons/fa"; // Importing icons
import ReviewForm from "./ReviewForm";
import { BACKEND_URL } from "@/app/config/config";
import { FaDeleteLeft } from "react-icons/fa6";

interface User {
  _id: string;
  name: string;
}
interface Review {
  _id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  userId: User;
}

const ReviewsSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleDelete = useCallback(
    async (reviewId: string) => {
      const token = localStorage.getItem("token");
      setDeleting(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      } catch (e) {
        console.log("error deletong review", e);
      }
    },
    [setDeleting, setReviews, setAverageRating]
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        console.log("revs", data.reviews);
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId, handleDelete]);

  const toggleReviewForm = () => {
    setIsReviewFormOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsReviewFormOpen(false);
  };

  return (
    <div className="reviews-section mt-8 relative">
      <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
      <div className="flex items-center mb-4">
        <div className="text-yellow-500 mr-2 flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={
                star <= averageRating ? "text-yellow-400" : "text-gray-300"
              }
            />
          ))}
        </div>
        <span>{averageRating && averageRating.toFixed(1)} / 5</span>
      </div>

      {averageRating && reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review._id} className="review mb-6 p-4 border rounded-lg">
              {review.userId._id === userId && (
                <button
                  disabled={deleting}
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600 float-right"
                >
                  <FaDeleteLeft />
                  Delete
                </button>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.userId.name}</span>
                <div className="text-yellow-500 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{review.text}</p>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to review this product!</p>
      )}

      <button
        className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={toggleReviewForm}
      >
        <FaEdit className="mr-2" />
        {isReviewFormOpen ? "Close Review Form" : "Leave a Review"}
      </button>

      {isReviewFormOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal on overlay click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 relative"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <ReviewForm productId={productId} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
