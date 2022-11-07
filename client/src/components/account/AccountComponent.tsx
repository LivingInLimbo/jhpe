import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";
import { Spinner } from "../app/Spinner";
import { Listing, ListingCard } from "../listings/ListingCard";
import { AccountEditComponent } from "./AccountEditComponent";

export const AccountComponent = () => {
  const getAccountData = gql`
    query getAccountData {
      getUser {
        id
        email
        phone
        firstName
        lastName
      }
      getListingsByUser {
        id
        title
        price
        images {
          name
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(getAccountData);
  useErrorHandler(error);

  return loading ? (
    <Spinner />
  ) : (
    <div className="flex w-full flex-col md:flex-row">
      <div className="flex flex-col w-full md:w-1/3">
        <span className="text-3xl font-bold mb-8">Account Info</span>
        <AccountEditComponent user={data.getUser} />
      </div>
      <div className="flex flex-col w-full md:w-2/3">
        <span className="text-3xl font-bold mb-8">Active Listings</span>
        <div className="flex flex-col grid grid-cols-4 auto-rows-fr gap-2">
          {data.getListingsByUser.map((listing: Listing) => (
            <ListingCard listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};
