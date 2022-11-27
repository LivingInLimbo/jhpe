import { Container } from "../components/app/Container";
import { SingleListingComponent } from "../components/listings/SingleListingComponent";
import { useParams, useNavigate, Navigate } from "react-router";
import { useQuery } from "@apollo/client";
import { Listing } from "../helpers/gqlTypes";
import { Spinner } from "../components/app/Spinner";
import { GET_SINGLE_LISTING } from "../helpers/gqlQueries";
import { useErrorHandler } from "react-error-boundary";

const SingleListing = () => {
  let navigate = useNavigate();
  const { listingId } = useParams();
  let id = parseInt(listingId || "");
  if (!id) {
    navigate("/home");
  }

  const { data, loading, error } = useQuery(GET_SINGLE_LISTING, {
    variables: { id },
  });
  useErrorHandler(error);

  return loading ? (
    <Spinner />
  ) : data && !data.getListing ? (
    <Navigate to="/home" />
  ) : (
    <Container>
      <SingleListingComponent
        listing={data.getListing}
        currUserOwns={data.checkUserOwnsListing}
      />
    </Container>
  );
};

export default SingleListing;
