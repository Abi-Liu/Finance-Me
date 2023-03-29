import { useEffect, useState } from "react";
import Transactions from "../components/Transactions";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { Container, Box, Button, AppBar, Stack } from "@mui/material";

axios.defaults.baseURL = "http://localhost:8000";

const Dashboard = ({ user }) => {
  const [linkToken, setLinkToken] = useState();
  const [account, setAccount] = useState();
  useEffect(() => {
    let ignore = false;

    async function fetchAccounts() {
      const accounts = await axios.get(`/api/accounts/${user._id}`);
      if (!ignore) {
        setAccount(accounts.data);
      }
    }
    fetchAccounts();
    return () => (ignore = true);
  }, []);

  //creating link token to plaid api
  useEffect(() => {
    let ignore = false;

    async function fetch() {
      const response = await axios.post("/api/create_link_token", {
        id: user._id,
      });
      if (!ignore) {
        setLinkToken(response.data.link_token);
        console.log(response);
      }
    }
    fetch();

    return () => (ignore = true);
  }, [account]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      async function setData() {
        try {
          let userAccount = await axios.post("/api/exchange_public_token", {
            public_token: public_token,
            id: user._id,
            metadata: metadata,
          });
          setAccount((prev) => [...prev, userAccount.data]);
        } catch (err) {
          console.log(err);
        }
      }
      setData();
    },
  });

  return (
    <Container>
      <Sidebar user={user} />
      <Box mt={4}>
        <Button variant="contained" onClick={() => open()} disabled={!ready}>
          Connect a bank account
        </Button>
        {account ? (
          <Transactions user={user} account={account} />
        ) : (
          <h3>Link a Bank Account to Get Started</h3>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
