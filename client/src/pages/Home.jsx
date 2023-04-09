import { Box, Container, Button } from "@mui/material";
import logo from "../assets/Financeme.png";

const Home = () => {
  function google() {
    window.open("auth/google", "_self");
  }

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "#FCFCFC",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img className="logo" src={logo} alt="FinanceMe Logo" />
          </div>
          <Box>
            <Button
              sx={{ backgroundColor: "#237EE9" }}
              onClick={google}
              variant="contained"
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
