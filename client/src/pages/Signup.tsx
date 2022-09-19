import { Container } from "../components/app/Container";
import { GoogleSignupLoginComponent } from "../components/login/GoogleSignupLoginComponent";

const Signup = () => (
  <Container>
    <GoogleSignupLoginComponent signup={true} />
  </Container>
);

export default Signup;
