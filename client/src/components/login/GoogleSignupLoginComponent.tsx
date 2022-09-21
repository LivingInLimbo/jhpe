import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useErrorHandler } from "react-error-boundary";
import { gql, useMutation, useQuery } from "@apollo/client";
import { optionsNoAuth } from "../../index";

export const GoogleSignupLoginComponent = ({
  signup = false,
  login = false,
}) => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userInfo"]);
  const [error, setError] = useState(null);
  useErrorHandler(error);

  const [credential, setCredential] = useState(null);

  useEffect(() => {
    if (cookies.userInfo != undefined) {
      navigate("/home");
    }
  }, []);

  const ADD_USER = gql`
    mutation addUser($credential: String!) {
      addUser(credential: $credential)
    }
  `;

  const [addUser, { loading, data, error: addUserError }] = useMutation(
    ADD_USER,
    {
      variables: { credential: credential },
    }
  );

  useEffect(() => {
    if (credential) {
      addUser();
    }
  }, [credential]);

  useEffect(() => {
    if (data) {
      setCookie("userInfo", data.addUser, { path: "/" });
      navigate("/new");
    }
  }, [data]);

  const handleSignupSuccess = (credentialResponse: any) => {
    setCredential(credentialResponse.credential);
  };

  if (loading) return <>loading</>;
  else if (error) return <>{error}</>;

  return (
    <GoogleOAuthProvider clientId="881162565258-uuumco442ojvsg1lhdt5bvosbuaf76qt.apps.googleusercontent.com">
      <div className="flex flex-col flex-grow w-full items-center justify-center">
        <div className="flex flex-col w-96 items-center rounded-md p-12">
          <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 via-blue-500 to-red-500 bg-clip-text text-transparent p-2">
            {signup ? "Sign Up" : "Log In"}
          </div>

          <GoogleLogin
            onSuccess={handleSignupSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
