// components/Loader.tsx

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white bg-opacity-50">
      <div className="w-24 h-24 border-4 border-solid border-softPink border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
