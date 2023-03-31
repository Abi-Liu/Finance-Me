import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { Container, Box, Button, Stack } from "@mui/material";

axios.defaults.baseURL = "http://localhost:8000";

const Dashboard = ({ user, account, transactions, setAccount }) => {
  const [linkToken, setLinkToken] = useState();
  // const [account, setAccount] = useState();
  // const [transactions, setTransactions] = useState([]);

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

  //creating link token to plaid api

  const options = {
    title: "Distribution",
    legend: "bottom",
  };

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

  //mapping same categories together
  const map = {};
  for (let expense of transactions) {
    if (map[expense.category]) {
      map[expense.category] = map[expense.category] + expense.amount;
    } else {
      map[expense.category] = expense.amount;
    }
  }

  //Converting the map object into an Array for the chart to read and adding a heading to the beginning of the array.
  let chartData = Object.entries(map);
  chartData.unshift(["Category", "Amount"]);

  return (
    <Container>
      <Sidebar user={user} />
      <Box sx={{ mb: 5 }}>
        <Button variant="contained" onClick={() => open()} disabled={!ready}>
          Connect a bank account
        </Button>
        <Stack direction="horizontal">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
          <h1>hi</h1>
        </Stack>
        {account ? (
          <h4>Graphs</h4>
        ) : (
          <h3>Link a Bank Account to Get Started</h3>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
