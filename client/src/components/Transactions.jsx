import { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import { Box, Typography } from "@mui/material";

axios.defaults.baseURL = "http://localhost:8000";

const Transactions = ({ user, account }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function fetchTransactions() {
      const response = await axios.post("/api/transactions", { account });
      if (!ignore) {
        setTransactions(response.data);
      }
    }
    fetchTransactions();
    return () => (ignore = true);
  }, [account]);
  let total = 0;
  if (transactions) {
    total = transactions.reduce((acc, x) => acc + x.totalTransactions, 0);
  }

  return (
    <Box mt={5}>
      {transactions.length !== 0 ? (
        <Box>
          <Typography sx={{ mb: 5 }} variant="h4">
            You have {total} transactions from your {transactions.length} bank{" "}
            {transactions.length === 1 ? "account" : "accounts"}
          </Typography>
          <Table transactions={transactions} />
        </Box>
      ) : (
        <h4>Fetching transactions</h4>
      )}
    </Box>
  );
};

export default Transactions;
