import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { IoClose, IoMenu } from "react-icons/io5";
import { Logo } from "./Logo";
import { headerLinks } from "./headerLinks";
import { SearchBar } from "./SearchBar";

export const MobileHeader = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  const navigate = useNavigate();

  const initHeaderState = false;
  const [headerState, setHeaderState] = useState(initHeaderState);
  const [headerContainerState, setHeaderContainerState] =
    useState(initHeaderState);
  const [transition, setTransition] = useState(!initHeaderState);
  const [scrollState, setScrollState] = useState(0);

  const handleClick = () => {
    if (headerState) {
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollState);
      setHeaderState(false);
      setTimeout(() => {
        setHeaderContainerState(false);
      }, 300);
    } else {
      var scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = "fixed";
      setScrollState(scrollY);
      setHeaderContainerState(true);
      setHeaderState(true);
    }
  };

  /*const testUserSignin = () => {
    requestHandler.testUserSignin().then((response) => {
      response.json().then((data) => {
        setCookie("userInfo", data.token, { path: "/" });
      });
    });
  };*/

  const headerItemClass =
    "flex h-full w-full items-center py-3 px-5 font-light text-lg border-b border-gray-300 hover:text-white hover:bg-black";

  return (
    <>
      <nav className="fixed z-10 h-12 top-0 bg-white bg-opacity-90 top-0 flex flex-col w-full visible lg:hidden">
        <div
          onClick={handleClick}
          className="absolute z-60  top-0 left-0 h-12 px-2 flex items-center justify-center font-light cursor-pointer"
        >
          <IoMenu size={25} />
        </div>
        <Logo />
      </nav>
      <div
        className={`fixed z-60 top-0 ${
          headerContainerState ? "left-0" : "-left-full"
        } w-full h-screen`}
      >
        <div
          className={`z-[9000] transition-all duration-500 flex flex-col absolute top-0 ${
            headerState ? "left-0 opacity-100" : "-left-full opacity-0"
          } bg-white shadow-md w-3/4 h-screen 
  `}
        >
          <div
            className="p-4 cursor-pointer border-b border-gray-300"
            onClick={handleClick}
          >
            <IoClose size={25} />
          </div>
          <div className="flex flex-col">
            {cookies.userInfo !== undefined ? (
              <div className="flex flex-col">
                {headerLinks.map((headerLink) => (
                  <Link
                    key={headerLink.name}
                    className={headerItemClass}
                    to={headerLink.link}
                  >
                    {headerLink.name}
                  </Link>
                ))}

                <div
                  className={headerItemClass + " cursor-pointer"}
                  onClick={() => {
                    removeCookie("userInfo", { path: "/" });
                    navigate("/home");
                  }}
                >
                  Logout
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link className={headerItemClass} to="/home">
                  Home
                </Link>

                <Link className={headerItemClass} to="/signup">
                  Sign Up
                </Link>

                <Link className={headerItemClass} to="/login">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={handleClick}
          className={`absolute z-60 bg-black transition-opacity duration-300 w-full h-screen ${
            headerState ? "opacity-80" : "opacity-0"
          }`}
        ></div>
      </div>
    </>
  );
};
