import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import type { Listing } from "./ListingCard";
import { ListingBatch } from "./ListingBatch";
import { ColorButton } from "../forms/ColorButton";
import { useSearchParams } from "react-router-dom";
import { ListingsSidebar } from "./ListingsSidebar";
import { CountAndSearchDisplay } from "./CountAndSearchDisplay";

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

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  useEffect(() => {
    setListings([
      <ListingBatch
        key={offset}
        offset={offset}
        search={search || ""}
        category={category || ""}
        sort={sort || ""}
      />,
    ]);
  }, [category, search, sort]);

  useEffect(() => {
    setListings([
      ...listings,
      <ListingBatch
        key={offset}
        offset={offset}
        search={search || ""}
        category={category || ""}
        sort={sort || ""}
      />,
    ]);
  }, [offset]);

  return (
    <div className="flex w-full">
      <ListingsSidebar />
      <div className="flex flex-col w-full">
        <CountAndSearchDisplay
          search={searchParams.get("search") || ""}
          category={searchParams.get("category") || ""}
        />
        <div className="grid w-full gap-2 auto-rows-fr grid-cols-3">
          {listings}
        </div>
      </div>
    </div>
  );
};
