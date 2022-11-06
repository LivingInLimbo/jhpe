import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "../app/Spinner";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { ImageCarousel } from "../createListing/ImageCarousel";
import { homeUrl } from "../../config";
import { Listing } from "./ListingCard";

export const SingleListingComponent = () => {
  let navigate = useNavigate();
  const { listingId } = useParams();
  let id = parseInt(listingId || "");
  if (!id) {
    navigate("/home");
  }

  const query = gql`
    query getListing($id: Int) {
      getListing(id: $id) {
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

  let listing: Listing | undefined;
  const { data, loading, error } = useQuery(query, { variables: { id } });
  if (data && !data.getListing) {
    navigate("/home");
  } else if (data) {
    listing = data.getListing;
    console.log(listing);
  }

  return !listing ? (
    <Spinner />
  ) : (
    <div className="w-full flex flex-col md:flex-row">
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
      </div>
    </div>
  );
};
