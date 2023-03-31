import React from "react";
import { Typography, Card, CardContent, Stack } from "@mui/material";

const BalanceCard = () => {
  return (
    <Card
      sx={{
        maxWidth: "330px",
        padding: "10px",
      }}
    >
      <CardContent>
        <Typography variant="h3">Bank Name</Typography>
        <Typography variant="subtitle1">Bank balance</Typography>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
