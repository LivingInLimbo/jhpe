import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { ColorButton } from "../forms/ColorButton";
import { useNavigate } from "react-router-dom";
import { Container } from "./Container";
import { IoRefreshOutline } from "react-icons/io5";

type props = {
  error: any;
};

export const ErrorPage = ({ error = null }: props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (error != null) {
      if (error.status == 401) {
        removeCookie("userInfo", { path: "/" });
      } else if (error.status) {
        error.json().then((data: any) => setErrorMsg(data.message));
      }
    }
  }, []);

  const reload = () => {
    window.location.reload();
  };

  return (
    <Container>
      <div className="z-10 flex flex-col flex-grow w-full  justify-center items-center text-center font-light text-black text-xl">
        <span className="text-7xl font-bold mb-4 text-red-600">Error!</span>
        {error ? (
          error.status == 401 ? (
            <div className="flex flex-col w-full justify-center">
              <div>Session expired, please log in again.</div>
              <div className="self-center mt-2">
                <ColorButton
                  label="Login"
                  onClick={() => {
                    removeCookie("userInfo", { path: "/" });
                    navigate("/login");
                  }}
                />
              </div>
            </div>
          ) : error.message != undefined ? ( // in the event of frontend JS errors
            error.message
          ) : error.status != undefined ? (
            <div className="flex flex-col">
              <span>
                Error {error.status}, {error.statusText}
              </span>
              <span className="mt-0">{errorMsg}</span>
            </div>
          ) : (
            "(No Error Message)"
          )
        ) : (
          "Undefined Error"
        )}
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
