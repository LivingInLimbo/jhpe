import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../assets/logos/banner_v7.png";

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="z-30 flex flex-grow justify-center lg:justify-start items-center h-12 select-none border-b-2 lg:border-0 border-gray-900 select-none">
      <div
        onClick={() => navigate("/home")}
        className="flex items-center w-auto h-full font-bold p-2 select-none cursor-pointer"
      >
        <img className="h-full object-contain" src={Banner} />
      </div>
    </div>
  );
};
