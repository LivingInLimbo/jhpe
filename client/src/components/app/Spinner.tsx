import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

export const Spinner = ({ type = "absolute" }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
    }, 1000);
    return function cleanup() {
      clearTimeout(id);
    };
  }, []);
  return (
    <div
      className={`${type} top-0 left-0 flex items-center justify-center h-full w-full`}
    >
      {loading && <CircularProgress sx={{ color: "black" }} />}
    </div>
  );
};
