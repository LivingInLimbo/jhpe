import { useState, memo } from "react";
import { gql, useQuery } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";

export const CountAndSearchDisplay = memo(
  ({ search, category }: { search: string; category: string }) => {
    const query = gql`
      query getListingCategories($category: String, $search: String) {
        getListingCount(search: $search, category: $category)
      }
    `;

    const { data, loading, error } = useQuery(query, {
      variables: { category, search },
    });
    if (data) console.log(data);
    useErrorHandler(error);

    return (
      <div className="flex flex-col w-full items-center font-light mb-4">
        {search && <span className="text-lg mb-2">Results for "{search}"</span>}
        <span>
          {!loading
            ? `${data.getListingCount} ${
                data.getListingCount == 1 ? "listing" : "listings"
              }`
            : ""}
        </span>
      </div>
    );
  }
);
