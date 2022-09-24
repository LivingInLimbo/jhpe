import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { Container } from "./Container";
import { IoRefreshOutline } from "react-icons/io5";
import { GraphQLError } from "graphql";
import { useNavigate } from "react-router";

export const ErrorPage = ({ error }: any) => {
  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((gqlError: GraphQLError) => {
        console.log(gqlError);
        if (gqlError.extensions.code == "UNAUTHENTICATED") {
          removeCookie("userInfo", { domain: "", path: "/" });
        }
      });
    }
  }, []);

  const reload = () => {
    window.location.reload();
  };

  return (
    <Container>
      <div className="z-10 flex flex-col flex-grow w-full  justify-center items-center text-center font-light text-black text-xl">
        <span className="text-7xl font-bold mb-4 text-red-600">Error!</span>
        <div>{error.message}</div>
        <div className="flex items-center text-black mt-4">
          Try refreshing the page.
          <div
            onClick={reload}
            className="p-1 border border-black text-black rounded-full ml-2 hover:text-white hover:bg-black cursor-pointer"
          >
            <IoRefreshOutline />
          </div>
        </div>
      </div>
    </Container>
  );
};
