import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../assets/logos/banner_v7.png";
import { SearchBar } from "./SearchBar";

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="z-30 flex grow items-center h-12 select-none border-b-2 lg:border-0 border-gray-900 select-none">
      <div className="flex items-center w-full h-full font-bold p-2 select-none cursor-pointer ml-8 lg:ml-0 ">
        <img
          onClick={() => navigate("/home")}
          className="h-full object-contain"
          src={Banner}
        />
        <SearchBar />
      </div>
    </div>
  );
};
