import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Table from "../components/Table";
import { Box, Typography, Container } from "@mui/material";

axios.defaults.baseURL = "http://localhost:8000";

const Transactions = ({ user, account, transactions, data }) => {
  // const [transactions, setTransactions] = useState([]);
  // const [account, setAccount] = useState();

  // useEffect(() => {
  //   let ignore = false;

  //   async function fetchAccounts() {
  //     const accounts = await axios.get(`/api/accounts/${user._id}`);
  //     if (!ignore) {
  //       setAccount(accounts.data);
  //     }
  //   }
  //   fetchAccounts();
  //   return () => (ignore = true);
  // }, []);

  // useEffect(() => {
  //   let ignore = false;
  //   async function fetchTransactions() {
  //     const response = await axios.post("/api/transactions", { account });
  //     if (!ignore) {
  //       setTransactions(response.data);
  //     }
  //   }
  //   fetchTransactions();
  //   return () => (ignore = true);
  // }, [account]);

  let total = 0;
  if (transactions) {
    total = transactions.reduce((acc, x) => acc + x.totalTransactions, 0);
  }

  return (
    <Box mt={5} sx={{ background: "#F5F5F5" }}>
      <Sidebar user={user} />
      <Container>
        {transactions.length !== 0 ? (
          <Box>
            <Typography sx={{ mb: 5 }} variant="h4">
              You have {total} transactions from your {transactions.length} bank{" "}
              {transactions.length === 1 ? "account" : "accounts"}
            </Typography>
            <Table data={data} />
          </Box>
        ) : (
          <h4>Fetching transactions</h4>
        )}
      </Container>
    </Box>
  );
};

export default Transactions;
