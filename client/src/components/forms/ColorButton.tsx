import React from "react";

type props = {
  type?: string;
  buttonType?: "button" | "submit";
  className?: String;
  height?: String;
  onClick?: any;
  label?: String;
  disabled?: Boolean;
  loading?: Boolean;
};

export const ColorButton = ({
  type = "",
  buttonType = "button",
  className = "",
  height = "h-auto",
  onClick = () => {},
  label = "Button",
  disabled = false,
  loading = false,
}: props) => {
  let buttonColors = "";
  let cursorType = "cursor-pointer";
  switch (type) {
    case "red":
      buttonColors = "hover:bg-red-600 border border-red-600 text-red-600";
      break;
    case "green":
      buttonColors = "hover:bg-green-700 border-green-700 text-green-700";
      break;
    case "blue":
      buttonColors = "hover:bg-blue-700 border-blue-700 text-blue-700";
      break;
    case "yellow":
      buttonColors = "hover:bg-yellow-600 border-yellow-600 text-yellow-600";
      break;
    case "gray":
      buttonColors = "hover:bg-gray-400 border-gray-600 text-gray-600";
      break;
    case "white":
      buttonColors = "hover:bg-black border-white text-white";
      break;
    default:
      buttonColors = "hover:bg-black border-black text-black";
  }

  if (disabled || loading) {
    buttonColors = "border-gray-400 text-gray-400";
  }
  if (disabled) {
    cursorType = "cursor-not-allowed";
  }
  if (loading) {
    cursorType = "cursor-wait";
  }

  return (
    <button
      type={buttonType}
      onClick={disabled || loading ? () => null : onClick}
      className={`${className} flex ${height} select-none items-center justify-center font-medium border text-xs ${
        disabled || loading ? "" : "hover:text-white"
      } ${buttonColors} ${cursorType} py-1 px-2 rounded focus:outline-none focus:shadow-outline `}
    >
      {label}
    </button>
  );
};
