import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { optionsNoAuth } from "../..";
import { useErrorHandler } from "react-error-boundary";

export const CreateListingComponent = () => {
  const GET_CATEGORIES = gql`
    query getCategories {
      categories {
        id
        name
        urlName
        subcategory {
          id
          name
          urlName
        }
      }
    }
  `;

  const categoryQuery = useQuery(GET_CATEGORIES);
  useErrorHandler(categoryQuery.error);
  if (categoryQuery.data) console.log(categoryQuery.data);

  return <div>lmfao</div>;
};
