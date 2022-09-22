import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { optionsNoAuth } from "../..";
import { useErrorHandler } from "react-error-boundary";

export const CreateListingComponent = () => {
  const GET_CATEGORIES = gql`
    query getCategories {
      getCategories {
        name
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_CATEGORIES);
  if (error) console.log(error);
  useErrorHandler(error);
  if (data) console.log(data);

  return <div>lmfao</div>;
};
