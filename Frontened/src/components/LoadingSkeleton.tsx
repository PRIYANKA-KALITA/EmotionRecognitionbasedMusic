import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;