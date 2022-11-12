import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { ListingCard } from "./ListingCard";
import { Listing } from "../../helpers/gqlTypes";

export const ListingBatch = ({
  offset = 1,
  search = "",
  category = "",
  sort = "",
}: {
  offset: number;
  search?: string;
  category?: string;
  sort?: string;
}) => {
  const query = gql`
    query getListings(
      $offset: Int
      $search: String
      $category: String
      $sort: String
    ) {
      getListings(
        offset: $offset
        search: $search
        category: $category
        sort: $sort
      ) {
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
        user {
          id
          email
          firstName
          lastName
          isGold
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    variables: { offset, search, category, sort },
  });

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
