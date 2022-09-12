import React from "react";
import { Link, NavigationType, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { IoClose, IoMenu, IoLogOutOutline } from "react-icons/io5";
import { GrMenu } from "react-icons/gr";
import { Logo } from "./Logo";
import { headerLinks } from "./headerLinks";

export const DesktopHeader = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  const navigate = useNavigate();

  const headerItemClass =
    "flex flex-grow overflow-visible text-sm h-full items-center py-3 px-5 font-light leading-tight hover:text-white hover:bg-black";

  return (
    <nav className="fixed z-9001 w-full top-0 bg-white hidden lg:flex border-b-2 border-gray-900 ">
      <Logo />
      <div className={`bg-white flex items-center h-12`}>
        {cookies.userInfo !== undefined ? (
          <div
            onClick={() => {}}
            className="flex h-full flex-row justify-self-end"
          >
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
                //navigate("/home");
              }}
            >
              Logout
              <IoLogOutOutline className="ml-1" size={18} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-row">
            <Link className={headerItemClass} to="/home">
              Home
            </Link>

            <Link className={headerItemClass} to="/signup">
              Signup
            </Link>

            <Link className={headerItemClass} to="/login">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
