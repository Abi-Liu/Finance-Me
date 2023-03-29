import React from "react";
import Sidebar from "../components/Sidebar";
import { Container } from "@mui/material";
const Random = ({ user }) => {
  return (
    <Container>
      <Sidebar user={user} />
      <h1>Random</h1>
    </Container>
  );
};

export default Random;
