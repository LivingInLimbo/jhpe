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

type RouteObj = {
  path: string;
  element: JSX.Element;
  exact: boolean;
};

function App() {
  return (
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
          <Route path="*" element={<Home />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
