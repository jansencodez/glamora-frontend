"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import ToastContainer from "../components/shared/toast/ToastContainer";

// Define the type for the Toast context
interface ToastContextType {
  addToast: (message: string, type: "success" | "error") => void;
}

// Create a context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<
    { message: string; type: "success" | "error" }[]
  >([]);

  // Function to add a new toast
  const addToast = (message: string, type: "success" | "error" = "success") => {
    setToasts((prev) => [...prev, { message, type }]);
  };

  // Remove toast after 3 seconds
  useEffect(() => {
    const timers = toasts.map((_, index) =>
      setTimeout(
        () => setToasts((prev) => prev.filter((_, i) => i !== index)),
        3000
      )
    );

    // Clear timers on cleanup
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
