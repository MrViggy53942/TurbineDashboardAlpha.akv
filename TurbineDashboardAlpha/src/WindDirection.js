import React from "react";

const WindDirection = ({ windDirection }) => {
  const needleStyle = {
    transform: `rotate(${windDirection}deg)`,
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow-md w-40">
      <h3 className="text-lg font-bold">Wind Direction</h3>
      <div className="relative w-24 h-24 flex items-center justify-center border-2 border-gray-700 rounded-full mt-2">
        <span className="absolute top-0">N</span>
        <span className="absolute bottom-0">S</span>
        <span className="absolute left-0">W</span>
        <span className="absolute right-0">E</span>
        <div
          className="absolute w-1 h-10 bg-red-600 origin-bottom"
          style={needleStyle}
        ></div>
      </div>
      <p className="text-sm mt-2">{windDirection}°</p>
    </div>
  );
};

export default WindDirection;
