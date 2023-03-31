import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BalanceCard = ({
  bank,
  accountName,
  availableBalance,
  currentBalance,
  type,
}) => {
  return (
    <Card
      sx={{
        maxWidth: "300px",
        minWidth: "300px",
        padding: "10px",
      }}
    >
      <CardContent>
        <CardHeader
          sx={{
            background: "#063D42",
            color: "#FFFFFF",
          }}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
          }
          title={bank}
        />
        <Typography variant="h6">{accountName}</Typography>
        <Typography variant="subtitle1">{type}</Typography>
        <Typography variant="subtitle1">{availableBalance}</Typography>
        <Typography variant="subtitle1">{currentBalance}</Typography>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
