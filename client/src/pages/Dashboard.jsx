import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
import Spinner from "../components/common/Spinner";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { Container, Box, Button, Stack, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";

axios.defaults.baseURL = "http://localhost:8000";

const Dashboard = ({ user, account, transactions, balance, setAccount }) => {
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

  const pieOptions = {
    title: "Distribution",
    legend: "left",
    backgroundColor: "#f5f5f5",
    colors: [
      "#00CDA9",
      "#FFCA00",
      "#C2B7FE",
      "#FF9A99",
      "#FFAC61",
      "#7EF8C3",
      "#20ACF6",
      "#1D8381",
      "#8974FF",
    ],
  };

  const barOptions = {
    title: "Spending",
    chartArea: { backgroundColor: "#f5f5f5" },
    legend: "right",
    bar: { groupWidth: "100%" },
    colors: [
      "#00CDA9",
      "#FFCA00",
      "#C2B7FE",
      "#FF9A99",
      "#FFAC61",
      "#7EF8C3",
      "#20ACF6",
      "#1D8381",
      "#8974FF",
    ],
    backgroundColor: "#f5f5f5",
  };

  return (
    <Box sx={{ height: "100vh", overflow: "auto", background: "#F5F5F5" }}>
      <Sidebar user={user} />
      {account.length === 0 ? (
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Link a bank account to get started!</h3>
          <Button
            sx={{
              width: "fit-content",
              background: "#237EE9",
              padding: "10px 15px",
              gap: "10px",
            }}
            variant="contained"
            onClick={() => open()}
            disabled={!ready}
          >
            <Add />
            Add an Account
          </Button>
        </Container>
      ) : balance.length === 0 ? (
        <Spinner />
      ) : (
        <Container>
          <Box mb={5}>
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
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              sx={{ pb: 5 }}
            >
              <Button
                sx={{
                  width: "fit-content",
                  background: "#237EE9",
                  padding: "10px 15px",
                  gap: "10px",
                }}
                variant="contained"
                onClick={() => open()}
                disabled={!ready}
              >
                <Add />
                Add an Account
              </Button>
            </Stack>
            <Container>
              <Grid container spacing={5}>
                {balance.map((item) => (
                  <BalanceCard
                    key={item.id}
                    id={item.id}
                    bank={item.bank}
                    accountName={item.accountName}
                    availableBalance={item.balance.available}
                    currentBalance={item.balance.current}
                    type={item.type}
                    setAccount={setAccount}
                  />
                ))}
              </Grid>
            </Container>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Dashboard;
