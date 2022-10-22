import { useEffect, useState } from "react";
import { LabledTextInput } from "../forms/LabledTextInput";
import { useNavigate } from "react-router";
import { ColorButton } from "../forms/ColorButton";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const searchListings = (e: any) => {
    e.preventDefault();
    navigate(`/listings?search=${searchValue}`);
  };

  return (
    <form className="flex w-full" onSubmit={searchListings}>
      <LabledTextInput
        value={searchValue}
        onChange={(e: any) => setSearchValue(e.target.value)}
        className="flex grow ml-3"
        placeholder="Search listings..."
      />
      <ColorButton label="Search" className="ml-2" onClick={searchListings} />
    </form>
  );
};
