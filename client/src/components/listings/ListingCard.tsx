import { useState } from "react";
import { homeUrl } from "../../config";
import { useNavigate } from "react-router";

export type Listing = {
  id: Number;
  title: String;
  description: String;
  price: number;
  category: {
    id?: Number;
    name: String;
  };
  subcategory: {
    id?: Number;
    name: String;
  };
  images: {
    name: string;
  }[];
  user?: {
    id: Number;
    phone: String;
    email: String;
    firstName: String;
    lastName: String;
    isGold: Boolean;
  };
};

export const ListingCard = ({ listing }: { listing: Listing }) => {
  let navigate = useNavigate();
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
        <div className="font-bold">{listing.title}</div>
        <div className="text-green-700">${listing.price}</div>
      </div>
    </div>
  );
};
