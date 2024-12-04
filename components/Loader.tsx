// components/Loader.tsx

const Loader = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-t-4 border-solid border-purple-800 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
