import { ReactNode } from "react";

interface ButtonLoaderProps {
  isLoading: boolean;
  children: ReactNode;
  onClick: (() => void) | ((e: React.FormEvent) => Promise<void>);
  className?: string; // Make className optional
}

const ButtonLoader = ({
  isLoading,
  children,
  onClick,
  className,
}: ButtonLoaderProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full inline-flex items-center justify-center p-4 bg-lavender text-white rounded-md font-semibold hover:bg-purple-600 transition-all disabled:opacity-50 ${className}`} // Apply passed className
      disabled={isLoading}
    >
      {/* Loader spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-6 h-6 border-4 border-t-4 border-solid border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Button text */}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
};

export default ButtonLoader;
