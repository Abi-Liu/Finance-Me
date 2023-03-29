import { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";

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
    <div>
      {transactions.length !== 0 ? (
        <div>
          <h4>
            You have {total} transactions from your {transactions.length} bank{" "}
            {transactions.length === 1 ? "account" : "accounts"}
          </h4>
          <Table transactions={transactions} />
        </div>
      ) : (
        <h4>Fetching transactions</h4>
      )}
    </div>
  );
};

export default Transactions;
