import { Container } from "../components/app/Container";
import { CreateListingComponent } from "../components/createListing/CreateListingComponent";
import { useErrorHandler } from "react-error-boundary";
import { gql, useQuery } from "@apollo/client";

const CreateListing = () => {
  const checkToken = gql`
    query checkToken {
      checkToken
    }
  `;

  const { data, loading, error } = useQuery(checkToken);
  useErrorHandler(error);

  return (
    <Container>
      <CreateListingComponent />
    </Container>
  );
};

export default CreateListing;
