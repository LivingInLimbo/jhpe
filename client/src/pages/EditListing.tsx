import { Container } from "../components/app/Container";
import { CreateListingComponent } from "../components/createListing/CreateListingComponent";
import { useErrorHandler } from "react-error-boundary";
import { gql, useQuery } from "@apollo/client";
import { GET_USER_LISTING } from "../helpers/gqlQueries";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../components/app/Spinner";

const EditListing = () => {
  let navigate = useNavigate();
  let { listingId } = useParams();
  let id = parseInt(listingId || "");
  if (!id) {
    navigate("/home");
  }
  const checkToken = gql`
    query checkToken {
      checkToken
    }
  `;

  const { data, loading, error } = useQuery(checkToken);
  useErrorHandler(error);

  const listingQuery = useQuery(GET_USER_LISTING, { variables: { id } });
  if (listingQuery.data && !listingQuery.data.getUserListing) {
    navigate("/home");
  }

  return listingQuery.loading ? (
    <Spinner />
  ) : (
    <Container>
      <CreateListingComponent listing={listingQuery.data.getUserListing} />
    </Container>
  );
};

export default EditListing;
