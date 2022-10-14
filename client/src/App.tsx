import React from "react";
import "./index.css";
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
  PathRouteProps,
} from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/app/ProtectedRoute";
import { NonAuthRoutes, ProtectedRoutes } from "./Routes";
import Home from "./pages/Home";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./components/app/ErrorPage";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { homeUrl } from "./config";
import { useCookies } from "react-cookie";
import Listings from "./pages/Listings";

type RouteObj = {
  path: string;
  element: JSX.Element;
  exact: boolean;
};

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const auth = cookies.userInfo !== undefined;

  const client = new ApolloClient({
    uri: `${homeUrl}/graphql`,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${cookies.userInfo}`,
    },
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Routes>
            {NonAuthRoutes.map((route: RouteObj) => (
              <Route key="" {...route} />
            ))}
            {ProtectedRoutes.map((route: RouteObj) => (
              <Route
                key=""
                path={route.path}
                element={<ProtectedRoute element={route.element} />}
              />
            ))}
            <Route path="*" element={<Listings />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
