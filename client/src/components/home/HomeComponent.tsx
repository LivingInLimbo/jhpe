import { ColorButton } from "../forms/ColorButton";
import { useState, useEffect } from "react";
import { optionsAuth, optionsNoAuth } from "../..";
import React from "react";
import { gql, useQuery } from "@apollo/client";

export const HomeComponent = () => {
  return (
    <div>
      <ColorButton label="Button" onClick={() => console.log("ayy lmao")} />
    </div>
  );
};
