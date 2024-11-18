import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid mr-2"></div>
      <span className="text-gray-600 text-sm font-medium">Fetching...</span>
    </div>
  );
};

export default Loader;
