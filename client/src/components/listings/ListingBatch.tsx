import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import type { Listing } from "./ListingCard";

export const ListingBatch = ({
  offset = 0,
  search = "",
}: {
  offset: number;
  search?: string;
}) => {
  console.log(offset);
  const query = gql`
    query getListings($offset: Int, $search: String) {
      getListings(offset: $offset, search: $search) {
        id
        title
        description
        price
        category {
          name
        }
        subcategory {
          name
        }
        images {
          name
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { offset, search },
  });
  if (data) console.log(data);

  return loading ? (
    <Spinner />
  ) : (
    <>
      {data.getListings.map((listing: Listing) => (
        <ListingCard key={`${listing.id}`} listing={listing} />
      ))}
    </>
  );
};
