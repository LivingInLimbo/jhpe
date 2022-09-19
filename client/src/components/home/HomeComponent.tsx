import { ColorButton } from "../forms/ColorButton";
import { useState, useEffect } from "react";
import { optionsAuth, optionsNoAuth } from "../..";
import React from "react";
import { gql, useQuery } from "@apollo/client";

export const HomeComponent = () => {
  const [state, setState] = useState();

  const IUSEDTOROLLLTHEDICE = ({ numDice = 3 }) => {
    const ROLL_DICE = gql`
      query RollDice {
        rollDice(numDice: ${numDice}, numSides: 6)
      }
    `;

    const { loading, error, data } = useQuery(ROLL_DICE, optionsNoAuth);

    useEffect(() => {
      console.log(data);
    }, [data]);

    return (
      <div>
        {loading ? "loading" : error ? error.message : "data loaded kekw"}
      </div>
    );
  };

  return (
    <div>
      <ColorButton label="Button" onClick={() => console.log("ayy lmao")} />
      <IUSEDTOROLLLTHEDICE />
    </div>
  );
};
