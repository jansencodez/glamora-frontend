// Define the type for the Toast props
interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast = ({ message, type }: ToastProps) => {
  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-300 ease-in-out ${
        type === "error" ? "bg-red-500 opacity-90" : "bg-green-500 opacity-90"
      }`}
      style={{
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
