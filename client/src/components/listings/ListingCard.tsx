import { useState } from "react";
import { homeUrl } from "../../config";
import { Listing } from "../../helpers/gqlTypes";

export const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => window.open(`/listing/${listing.id}`, "_blank")}
    >
      <div className="w-full aspect-square border border-opacity-30 border-gray-400 rounded-md">
        <img
          className="w-full h-full object-contain"
          src={`${homeUrl}/uploads/${listing.images[0].name}`}
        />
      </div>
      <div className="flex flex-col mt-4 ml-0.5">
        <div className="text-green-700">${listing.price.toLocaleString()}</div>
        <div className="font-bold">{listing.title}</div>
      </div>
    </div>
  );
};
