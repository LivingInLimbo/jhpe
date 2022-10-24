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

  return (
    <div className="w-[256px] ml-8">
      {!loading
        ? data.categories.map((category: any) => (
            <div className="flex flex-col w-full font-light">
              <div
                className={`hover:underline cursor-pointer ${
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
                    className={`hover:underline cursor-pointer ${
                      params.get("category") == subcategory.urlName
                        ? "font-bold underline"
                        : ""
                    }`}
                    onClick={() =>
                      setParams(
                        addParam(params, "category", subcategory.urlName)
                      )
                    }
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            </div>
          ))
        : ""}
    </div>
  );
});
