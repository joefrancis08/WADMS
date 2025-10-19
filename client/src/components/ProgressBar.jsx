import React from "react";

const ProgressBar = ({ progress, color = "bg-green-500", status }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full z-20 -mb-16">
      <div className="relative w-full bg-slate-700 border border-slate-600 rounded-full h-4 shadow-inner overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className={`h-full ${color} transition-all duration-700 ease-in-out rounded-full`}
        ></div>
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-semibold text-xs text-white">
          {progress}%
        </span>
      </div>
      <p className="mt-1 text-center text-xs font-medium text-white">{status}</p>
    </div>
  );
};

export default ProgressBar;
