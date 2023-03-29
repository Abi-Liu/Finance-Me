import { AppBar, Avatar, IconButton, Stack, Typography } from "@mui/material";

const Header = ({ user }) => {
  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{ background: "#FCFCFC" }}
    >
      <Stack
        direction="row"
        width="100%"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Stack
          direction="row"
          gap="16px"
          alignItems="center"
          justifyContent="center"
        >
          {user?.firstName ? (
            <Typography variant="h6" component="p">
              {user?.firstName}
            </Typography>
          ) : null}
          {user?.avatar ? (
            <Avatar src={user?.avatar} alt={user?.firstName} />
          ) : null}
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default Header;
