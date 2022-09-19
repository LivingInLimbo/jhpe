import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { homeUrl } from "./config";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./components/app/ErrorPage";
import { Cookies, CookiesProvider } from "react-cookie";

const authClient = new ApolloClient({
  uri: `${homeUrl}/authGql`,
  cache: new InMemoryCache(),
});

const nonAuthClient = new ApolloClient({
  uri: `${homeUrl}/noAuthGql`,
  cache: new InMemoryCache(),
});

export const optionsAuth = { client: authClient };
export const optionsNoAuth = { client: nonAuthClient };

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <CookiesProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
