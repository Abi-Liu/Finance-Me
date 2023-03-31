import React from "react";
import GridLoader from "react-spinners/GridLoader";
import { Box } from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        mt: "250px",
        height: "100%",
        width: "100px",
        mx: "auto",
        display: "block",
      }}
    >
      <GridLoader color="#0B95A2" size={20} margin={1} />
    </Box>
  );
};

export default Spinner;
