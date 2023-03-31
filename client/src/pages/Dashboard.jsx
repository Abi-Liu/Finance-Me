import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
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
  let pieData = Object.entries(map);
  pieData.unshift(["Category", "Amount"]);

  let barData = [];
  barData.push(Object.keys(map));
  barData.push(Object.values(map));
  barData[0].unshift("Category");
  barData[1].unshift("Amount per Category");

  console.log(barData);
  console.log(pieData);

  const pieOptions = {
    title: "Distribution",
    legend: "left",
    backgroundColor: "#f5f5f5",
    colors: ["#1BA1B8", "#2AA549", "#DF3745", "#F87B00", "#FCC00F", "#147EFB"],
  };

  const barOptions = {
    title: "Spending",
    chartArea: { backgroundColor: "#f5f5f5" },
    legend: "right",
    bar: { groupWidth: "100%" },
    colors: ["#1BA1B8", "#2AA549", "#DF3745", "#F87B00", "#FCC00F", "#147EFB"],
    backgroundColor: "#f5f5f5",
  };

  return (
    <Box sx={{ height: "100vh", overflow: "auto", background: "#F5F5F5" }}>
      <Container>
        <Sidebar user={user} />
        <Stack justifyContent="center" alignItems="end">
          <Button
            sx={{ width: "fit-content" }}
            variant="contained"
            onClick={() => open()}
            disabled={!ready}
          >
            Connect a bank account
          </Button>
        </Stack>

        {account ? (
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Chart
                chartType="PieChart"
                data={pieData}
                options={pieOptions}
                width={"100%"}
                height={"400px"}
              />
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={barData}
                options={barOptions}
              />
            </Stack>

            <Box pb={3}>
              <BalanceCard />
              <BalanceCard />
              <BalanceCard />
            </Box>
          </Box>
        ) : (
          <h3>Link a Bank Account to Get Started</h3>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
