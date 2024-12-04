"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas"; // Import html2canvas
import { BACKEND_URL } from "../config/config";

interface OrderDetails {
  orderId: string;
  totalPrice: number;
  finalPrice: number;
  shipping: {
    fullName: string;
    address: string;
    city: string;
    deliveryDate: string;
    country: string;
    phone: string;
  };
}

export default function VerifyPaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const router = useRouter();
  const orderId = localStorage.getItem("orderId");
  const token = localStorage.getItem("token");

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const calculateDeliveryDate = (date: string) => {
    const orderDate = new Date(date);
    return orderDate.toLocaleDateString();
  };

  const verifyPayment = useCallback(
    async (reference: string) => {
      try {
        const response = await fetch(
          `${BACKEND_URL}}/api/payment/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reference, orderId }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.status);
          setOrderDetails(data.order);
        } else {
          const rawResponse = await response.text();
          console.log("API Error:", rawResponse);
          setErrorMessage("Payment verification failed");
        }
      } catch (error) {
        console.log("Error verifying payment:", error);
        setErrorMessage("An error occurred while verifying the payment.");
      } finally {
        setLoading(false);
      }
    },
    [token, orderId]
  );

  useEffect(() => {
    if (!reference || !orderId) {
      setErrorMessage("Missing payment reference or order ID.");
      setLoading(false);
    } else {
      verifyPayment(reference);
    }
  }, [reference, orderId, verifyPayment]);

  const downloadReceipt = async (): Promise<void> => {
    if (!orderDetails || !qrCodeRef.current) return;

    const doc = new jsPDF();

    // Capture the QR code directly using html2canvas
    html2canvas(qrCodeRef.current).then((canvas) => {
      const qrCodeImgData = canvas.toDataURL("image/png");

      // Header
      doc.setFontSize(18);
      doc.text("Payment Receipt", 105, 20, { align: "center" });

      // Payment Status
      doc.setFontSize(12);
      doc.text(`Payment Status: ${paymentStatus}`, 20, 40);

      // Order Details
      doc.text("Order Details:", 20, 50);
      doc.text(`Order ID: ${orderDetails.orderId}`, 20, 60);
      doc.text(`Total Price: ${orderDetails.totalPrice}`, 20, 70);
      doc.text(`Final Price: ${orderDetails.finalPrice}`, 20, 80);
      doc.text(
        `Delivery Date: ${calculateDeliveryDate(
          orderDetails.shipping.deliveryDate
        )}`,
        20,
        90
      );

      // Shipping Address
      doc.text("Shipping Address:", 20, 110);
      doc.text(`Name: ${orderDetails.shipping.fullName}`, 20, 120);
      doc.text(`Address: ${orderDetails.shipping.address}`, 20, 130);
      doc.text(`City: ${orderDetails.shipping.city}`, 20, 140);
      doc.text(`Country: ${orderDetails.shipping.country}`, 20, 150);
      doc.text(`Phone: ${orderDetails.shipping.phone}`, 20, 160);

      // Add QR code image to the PDF
      doc.addImage(qrCodeImgData, "PNG", 140, 30, 50, 50);

      // Footer
      doc.text("Thank you for your purchase!", 105, 200, { align: "center" });

      // Save the PDF
      doc.save(`receipt_${orderDetails.orderId}.pdf`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 main">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Payment Verification
      </h1>

      {loading ? (
        <div className="text-gray-700">Verifying your payment...</div>
      ) : errorMessage ? (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            Payment Status: {paymentStatus}
          </div>

          {orderDetails && (
            <div className="bg-gray-100 p-6 rounded-md mb-4 relative">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Details
              </h2>

              <p>
                <strong>Order ID:</strong> {orderDetails.orderId}
              </p>

              {/* QR Code Container */}
              <div className="mt-4">
                <div
                  ref={qrCodeRef}
                  className="p-4 max-w-[120px] max-h-[120px]"
                >
                  <QRCode value={orderDetails.orderId} size={100} />
                </div>
              </div>

              <p>
                <strong>Total Price:</strong> {orderDetails.totalPrice}
              </p>
              <p>
                <strong>Final Price:</strong> {orderDetails.finalPrice}
              </p>
              <p>
                <strong>Delivery Date:</strong>{" "}
                {calculateDeliveryDate(orderDetails.shipping.deliveryDate)}
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-4">
                Shipping Address
              </h3>
              <p>{orderDetails.shipping.fullName}</p>
              <p>{orderDetails.shipping.address}</p>
              <p>
                {orderDetails.shipping.city}, {orderDetails.shipping.country}
              </p>
              <p>{orderDetails.shipping.phone}</p>

              <button
                onClick={downloadReceipt}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 mt-4"
              >
                Download Receipt
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
