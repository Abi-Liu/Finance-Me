import { useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

axios.defaults.baseURL = "https://financeme-rwlo.onrender.com";

const BalanceCard = ({
  bank,
  accountName,
  availableBalance,
  currentBalance,
  type,
  setAccount,
  id,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function deleteAccount() {
    await axios.delete(`/api/account/${id}`);

    setAccount((prev) => {
      return prev.filter((account) => account._id !== id);
    });
  }

  return (
    <Grid item xs={12} md={4}>
      <Card
        sx={{
          maxWidth: { lg: "320px", md: "270px", sm: "320px" },
          minWidth: { lg: "320px", md: "270px", sm: "320px" },
          padding: "10px",
        }}
      >
        <CardHeader
          sx={{
            background: "#0b95a2",
            color: "#FFFFFF",
          }}
          action={
            <IconButton
              aria-label="settings"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
          }
          title={bank}
        />
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={deleteAccount}>Delete Account</MenuItem>
        </Menu>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "10px",
            paddingX: "5px",
          }}
        >
          <Stack direction="column" alignItems="start" justifyContent="start">
            <Typography variant="h6">{accountName}</Typography>
          </Stack>
          <Stack justifyContent="end" alignItems="center">
            {type === "depository" ? (
              <Typography variant="h6">${availableBalance}</Typography>
            ) : (
              <Typography variant="h6">${currentBalance}</Typography>
            )}
            {type === "depository" ? (
              <Typography variant="caption">Available Balance:</Typography>
            ) : (
              <Typography variant="caption">Current Balance:</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BalanceCard;
