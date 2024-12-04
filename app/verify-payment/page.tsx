"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BACKEND_URL } from "../config/config";

interface OrderDetails {
  orderId: string;
  deliveryDate: string;
  shippingAddress: string;
  totalPrice: number;
  currency: string;
}

const InnerVerifyPaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const reference = searchParams?.get("reference") || "";
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const calculateDeliveryDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const verifyPayment = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const orderId = localStorage.getItem("orderId");

    if (!token || !orderId) {
      setErrorMessage("Missing required credentials. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference, orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify payment.");
      }

      const data = await response.json();
      setPaymentStatus(data.status);
      setOrderDetails(data.orderDetails);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [reference]);

  const downloadReceipt = async (): Promise<void> => {
    if (!orderDetails || !qrCodeRef.current) return;

    const pdf = new jsPDF();
    const qrCanvas = await html2canvas(qrCodeRef.current);

    pdf.text("Receipt", 10, 10);
    pdf.text(`Order ID: ${orderDetails.orderId}`, 10, 20);
    pdf.text(
      `Delivery Date: ${calculateDeliveryDate(orderDetails.deliveryDate)}`,
      10,
      30
    );
    pdf.text(`Shipping Address: ${orderDetails.shippingAddress}`, 10, 40);
    pdf.text(
      `Total Price: ${orderDetails.currency} ${orderDetails.totalPrice}`,
      10,
      50
    );
    pdf.addImage(qrCanvas.toDataURL(), "PNG", 10, 60, 50, 50);
    pdf.save(`receipt-${orderDetails.orderId}.pdf`);
  };

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setErrorMessage("Missing payment reference.");
      setLoading(false);
    }
  }, [reference, verifyPayment]);

  return (
    <div className="p-6 main">
      {loading && <p>Verifying your payment...</p>}

      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}

      {!loading && paymentStatus && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold">Payment {paymentStatus}</h1>

          {orderDetails && (
            <div>
              <p>Order ID: {orderDetails.orderId}</p>
              <p>
                Delivery Date:{" "}
                {calculateDeliveryDate(orderDetails.deliveryDate)}
              </p>
              <p>Shipping Address: {orderDetails.shippingAddress}</p>
              <p>
                Total Price: {orderDetails.currency} {orderDetails.totalPrice}
              </p>

              <div ref={qrCodeRef}>
                <QRCode value={orderDetails.orderId || ""} size={128} />
              </div>

              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                onClick={downloadReceipt}
              >
                Download Receipt
              </button>
            </div>
          )}
        </div>
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
};

const VerifyPaymentPage: React.FC = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <InnerVerifyPaymentPage />
  </Suspense>
);

export default VerifyPaymentPage;
