import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { IoClose, IoMenu } from "react-icons/io5";
import { GrMenu } from "react-icons/gr";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

export const Header = () => {
  return (
    <>
      <DesktopHeader /> <MobileHeader />
    </>
  );
};
