import Toast from "./Toast";

interface ToastType {
  message: string;
  type: "success" | "error";
}

const ToastContainer = ({ toasts }: { toasts: ToastType[] }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast key={index} message={toast.message} type={toast.type} />
      ))}
    </>
  );
};

export default ToastContainer;
