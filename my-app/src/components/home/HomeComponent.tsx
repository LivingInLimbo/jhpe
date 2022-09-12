import { ColorButton } from "../forms/ColorButton";
import { useState, useEffect } from "react";

export const HomeComponent = () => {
  const handleClick = () => {
    console.log("sussy");
  };

  return (
    <div>
      <ColorButton label="Button" onClick={handleClick} />
      Home
    </div>
  );
};
