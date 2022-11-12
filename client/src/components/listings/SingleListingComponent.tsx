import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { ImageCarousel } from "../createListing/ImageCarousel";
import { Listing } from "../../helpers/gqlTypes";
import { homeUrl } from "../../config";
import { GET_SINGLE_LISTING } from "../../helpers/gqlQueries";

export const SingleListingComponent = () => {
  let navigate = useNavigate();
  const { listingId } = useParams();
  let id = parseInt(listingId || "");
  if (!id) {
    navigate("/home");
  }

  let listing: Listing | undefined;
  const { data, loading, error } = useQuery(GET_SINGLE_LISTING, {
    variables: { id },
  });
  if (data && !data.getListing) {
    navigate("/home");
  } else if (data) {
    listing = data.getListing;
    console.log(listing);
  }

  return !listing ? (
    <Spinner />
  ) : (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <ImageCarousel
        imgSrcs={listing.images.map(
          (image) => `${homeUrl}/uploads/${image.name}`
        )}
      />
      <div className="flex flex-col w-full lg:w-[400px] p-8">
        <div className="font-light text-gray-500 mb-2">
          {listing.category.name + " > " + listing.subcategory.name}
        </div>
        <div
          className={`text-2xl font-medium text-left mb-1 w-full overflow-hidden text-ellipsis`}
        >
          {listing.title}
        </div>
        <div className={`text-md font-normal mb-8 text-green-700`}>
          ${listing.price}
        </div>
        <div className={`text-md font-light text-left`}>
          {listing.description}
        </div>
        <div className="flex flex-col w-full p-2 border border-gray-400 rounded-md mt-8 font-light">
          <span className="font-bold mb-2">Seller Details</span>
          <span className={`${!listing.user.firstName ? "text-gray-500" : ""}`}>
            {listing.user.firstName
              ? `${listing.user.firstName} ${listing.user.lastName}`
              : "No Name"}
          </span>
          <span className={`${!listing.user.phone ? "text-gray-500" : ""}`}>
            {listing.user.phone || "No Phone"}
          </span>

          {listing.user.email}
        </div>
      </div>
    </div>
  );
};
