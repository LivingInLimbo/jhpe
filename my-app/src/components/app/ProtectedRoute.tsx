import { Navigate, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

type props = {
  element: JSX.Element;
};

export const ProtectedRoute = ({ element: Element, ...restofProps }: props) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const auth = cookies.userInfo !== undefined;

  return auth ? Element : <Navigate to="/login" />;
};