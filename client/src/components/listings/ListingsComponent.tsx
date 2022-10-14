import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import type { Listing } from "./ListingCard";

export const ListingsComponent = () => {
  const query = gql`
    query getListings {
      getListings {
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

  const { loading, error, data } = useQuery(query);
  if (data) console.log(data);

  return loading ? (
    <Spinner />
  ) : (
    <div className="w-full">
      <div className="grid w-full gap-2 auto-rows-fr grid-cols-3">
        {data.getListings.map((listing: Listing) => (
          <ListingCard listing={listing} />
        ))}
      </div>
    </div>
  );
};
