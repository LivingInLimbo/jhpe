import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";
import SingleListing from "./pages/SingleListing";
import Account from "./pages/Account";
import EditListing from "./pages/EditListing";

// Define different route list based on auth level
// TODO: more user roles to be added

type Route = {
  path: string;
  element: JSX.Element;
  exact: boolean;
};

// Accessible by any roles
export const NonAuthRoutes: Route[] = [
  {
    path: "/home",
    element: <Home />,
    exact: true,
  },
  {
    path: "/login",
    element: <Login />,
    exact: true,
  },
  {
    path: "/signup",
    element: <Signup />,
    exact: true,
  },
  {
    path: "/listings",
    element: <Listings />,
    exact: true,
  },
  {
    path: "/listing/:listingId",
    element: <SingleListing />,
    exact: true,
  },

  // Add new here...*/
];

export const ProtectedRoutes: Route[] = [
  //Examples for routes that need authorization
  //To be replaced later
  {
    path: "/new",
    element: <CreateListing />,
    exact: true,
  },
  {
    path: "/account",
    element: <Account />,
    exact: true,
  },
  {
    path: "/edit/:listingId",
    element: <EditListing />,
    exact: true,
  } /*,
  {
    path: "/lookbooks",
    element: <ViewLookbooks />,
    exact: true,
  },
  {
    path: "/addOutfit",
    element: <AddOutfit />,
    exact: true,
  },
  {
    path: "/editOutfit/:outfitId",
    element: <AddOutfit />,
    exact: true,
  },
  {
    path: "/viewOutfit/:outfitId",
    element: <ViewIndividualOutfit />,
    exact: true,
  },
  {
    path: "/outfitsByClothing/:pieceId",
    element: <ViewOutfitsByClothing />,
    exact: true,
  },
  {
    path: "/outfitsByClothing/",
    element: <ViewOutfitsByClothing />,
    exact: true,
  },
  {
    path: "/editClothing/:clothingId",
    element: <EditClothing />,
    exact: true,
  },
  {
    path: "/addLookbook",
    element: <AddLookbook />,
    exact: true,
  },
  {
    path: "/lookbook/:lookbookId",
    element: <ViewLookbook />,
    exact: true,
  },
  {
    path: "/editLookbook/:lookbookId",
    element: <AddLookbook />,
    exact: true,
  },
  {
    path: "/account",
    element: <AccountEdit />,
    exact: true,
  },
  {
    path: "/welcome",
    element: <NewUserTutorial />,
    exact: true,
  },
  {
    path: "/supersecret/admin",
    element: <Admin />,
    exact: true,
  },
  {
    path: "/analytics",
    element: <ClothingAnalytics />,
    exact: true,
  },
  {
    path: "/addWears",
    element: <AddWears />,
    exact: true,
  },*/,
];
