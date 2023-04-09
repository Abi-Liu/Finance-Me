import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";

// axios.defaults.baseURL = "https://financeme-rwlo.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState([]);
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("auth/login/success", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  //Get accounts linked to user
  useEffect(() => {
    let ignore = false;

    async function fetchAccounts() {
      const accounts = await axios.get(`api/accounts/${user._id}`);
      if (!ignore) {
        setAccount(accounts.data);
      }
    }
    fetchAccounts();
    return () => (ignore = true);
  }, [user]);

  //Get transactions linked to user's bank accounts
  useEffect(() => {
    let ignore = false;
    async function fetchTransactions() {
      const response = await axios.post("api/transactions", { account });
      if (!ignore) {
        setTransactions(response.data);
      }
    }
    fetchTransactions();

    async function fetchBalance() {
      const response = await axios.post("api/balance", { account });
      if (!ignore) {
        setBalance(response.data);
      }
    }
    fetchBalance();

    return () => (ignore = true);
  }, [account]);

  let data = [];

  transactions.forEach((account) => {
    account.transactions.forEach((transaction) => {
      data.push({
        account: account.accountName,
        date: transaction.date,
        category: transaction.category[0],
        name: transaction.name,
        amount: Math.abs(transaction.amount),
      });
    });
  });

  data.sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!user ? <Home /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                account={account}
                transactions={data}
                balance={balance}
                setAccount={setAccount}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            user ? (
              <Transactions
                user={user}
                account={account}
                transactions={transactions}
                data={data}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
