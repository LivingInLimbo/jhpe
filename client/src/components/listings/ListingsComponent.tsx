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
import { useErrorHandler } from "react-error-boundary";

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

  const query = gql`
    query getListingCount($category: String, $search: String) {
      getListingCount(category: $category, search: $search)
    }
  `;

  const { data, loading, error } = useQuery(query);
  useErrorHandler(error);

  useEffect(() => {
    setListings([
      <ListingBatch
        key={0}
        offset={0}
        search={search || ""}
        category={category || ""}
        sort={sort || ""}
      />,
    ]);
    setOffset(0);
  }, [category, search, sort]);

  useEffect(() => {
    if (offset != 0 && offset != (data?.getListingCount || 0)) {
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
    }
  }, [offset]);

  return loading ? (
    <Spinner />
  ) : (
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
