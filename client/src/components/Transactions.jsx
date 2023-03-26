import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

const Transactions = ({ user, account }) => {
  const [transactions, setTransactions] = useState();
  useEffect(() => {
    let ignore = false;
    async function fetchTransactions() {
      const response = await axios.post("/api/transactions", { account });
      if (!ignore) {
        //   setTransactions(response.data);
        console.log(response.data);
      }
    }
    fetchTransactions();
    return () => (ignore = true);
  }, [account]);

  return <div>Transactions</div>;
};

export default Transactions;
