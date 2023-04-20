import { useEffect, useState } from "react";
import Spinner from "../components/common/Spinner";
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
  console.log(transactions);
  return (
    <Box mt={5} sx={{ height: "100vh", background: "#F5F5F5" }}>
      <Sidebar user={user} />
      <Container>
        {transactions.length !== 0 ? (
          <Box>
            <Table data={data} />
          </Box>
        ) : (
          <Spinner />
        )}
      </Container>
    </Box>
  );
};

export default Transactions;
