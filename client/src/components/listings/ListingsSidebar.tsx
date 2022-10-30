import { useState, memo } from "react";
import { useQuery, gql } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";
import { useSearchParams } from "react-router-dom";
import { addParam } from "../../helpers/searchParamsHelpers";

export const ListingsSidebar = memo(() => {
  const query = gql`
    query getCategories {
      categories {
        id
        urlName
        name
        subcategory {
          id
          urlName
          name
        }
      }
    }
  `;
  const { data, loading, error } = useQuery(query);
  useErrorHandler(error);

  const [params, setParams] = useSearchParams();

  const sideBarItemClass = "hover:underline cursor-pointer";

  const sort = params.get("sort");

  type sortOption = {
    text: string;
    url: string;
  };

  const sortOptions: sortOption[] = [
    { text: "Price: Highest", url: "price-desc" },
    { text: "Price: Lowest", url: "price-asc" },
    { text: "Newest", url: "last_update-desc" },
    { text: "Oldest", url: "last_update-asc" },
  ];

  return (
    <div className="w-[128px] mr-8">
      <div className="text-lg font-bold mb-2">Category</div>
      {!loading &&
        data.categories.map((category: any) => (
          <div className="flex flex-col w-full font-light">
            <div
              className={`${sideBarItemClass} ${
                params.get("category") == category.urlName
                  ? "font-bold underline"
                  : ""
              }`}
              onClick={() =>
                setParams(addParam(params, "category", category.urlName))
              }
            >
              {category.name}
            </div>

            <div className="ml-4">
              {category.subcategory.map((subcategory: any) => (
                <div
                  className={`${sideBarItemClass} ${
                    params.get("category") == subcategory.urlName
                      ? "font-bold underline"
                      : ""
                  }`}
                  onClick={() =>
                    setParams(addParam(params, "category", subcategory.urlName))
                  }
                >
                  {subcategory.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      <div className="text-lg font-bold mt-8 mb-2">Sort</div>
      <div className="flex flex-col font-light">
        {sortOptions.map((sortOption: sortOption) => {
          return (
            <span
              onClick={() =>
                setParams(addParam(params, "sort", sortOption.url))
              }
              className={`${sideBarItemClass} ${
                sort == sortOption.url ? "font-bold underline" : ""
              }`}
            >
              {sortOption.text}
            </span>
          );
        })}
      </div>
    </div>
  );
});
