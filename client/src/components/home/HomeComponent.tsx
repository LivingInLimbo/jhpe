import { ColorButton } from "../forms/ColorButton";
import { useState, useEffect } from "react";
import { optionsAuth, optionsNoAuth } from "../..";
import React from "react";
import { gql, useQuery } from "@apollo/client";

export const HomeComponent = () => {
  const LMAO = gql`
    query susQuery {
      sus {
        id
        name
      }
    }
  `;

  const { loading, data, error } = useQuery(LMAO);
  if (data) console.log(data);
  if (loading) console.log(loading);
  if (error) console.log(error);

  return (
    <div>
      <ColorButton label="Button" onClick={() => console.log("ayy lmao")} />
    </div>
  );
};
