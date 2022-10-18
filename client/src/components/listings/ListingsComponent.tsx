import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import type { Listing } from "./ListingCard";
import { ListingBatch } from "./ListingBatch";
import { ColorButton } from "../forms/ColorButton";

export const ListingsComponent = () => {
  const [listings, setListings] = useState<JSX.Element[]>([]);
  const [offset, setOffset] = useState(0);

  const addBatch = () => {
    setOffset(offset + 1);
  };

  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      addBatch();
    }
  };

  useEffect(() => {
    setListings([...listings, <ListingBatch key={offset} offset={offset} />]);
  }, [offset]);

  return (
    <div className="w-full">
      <div className="grid w-full gap-2 auto-rows-fr grid-cols-3">
        {listings}
      </div>
    </div>
  );
};
