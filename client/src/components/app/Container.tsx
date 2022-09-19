import { Header } from "../header/Header";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./ErrorPage";
//import { Footer } from "./Footer";
import { enableScroll } from "../../helpers/miscHelpers";
import React from "react";

type props = {
  className?: string;
  noPadding?: boolean;
  children: JSX.Element;
};

export const Container = ({
  className = "",
  noPadding = false,
  children,
}: props) => {
  useEffect(() => {
    enableScroll(document);
  }, []);
  return (
    <div className={`${className} min-w-[300px]`}>
      <Header />

      <div className={`pt-12 flex flex-col w-full  min-h-screen`}>
        <div
          className={`flex flex-col flex-grow w-full ${
            noPadding ? "p-0" : "p-2 lg:p-6"
          }`}
        >
          {children}
        </div>
        {/*showFooter && <Footer />*/}
      </div>
    </div>
  );
};
