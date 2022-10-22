import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import type { Listing } from "./ListingCard";
import { ListingBatch } from "./ListingBatch";
import { ColorButton } from "../forms/ColorButton";
import { useSearchParams } from "react-router-dom";

export const ListingsComponent = () => {
  const [listings, setListings] = useState<JSX.Element[]>([]);
  const [offset, setOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const addBatch = () => {
    setOffset(offset + 1);
  };

  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      addBatch();
    }
  };

  useEffect(() => {
    setListings([
      <ListingBatch
        key={offset}
        offset={offset}
        search={searchParams.get("search") || ""}
      />,
    ]);
  }, [searchParams.get("search")]);

  useEffect(() => {
    setListings([
      ...listings,
      <ListingBatch
        key={offset}
        offset={offset}
        search={searchParams.get("search") || ""}
      />,
    ]);
  }, [offset]);

  return (
    <div className="flex flex-col w-full">
      <div className="grid w-full gap-2 auto-rows-fr grid-cols-3">
        {listings}
      </div>
    </div>
  );
};
