import { useState, useEffect } from "react";
import axios from "axios";

const Auth = ({ publicToken, user, metadata }) => {
  const [account, setAccount] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        let account = await axios.post("api/exchange_public_token", {
          public_token: publicToken,
          id: user._id,
          metadata: metadata,
        });
        console.log(account);

        // const auth = await axios.post("api/auth", {
        //   access_token: accessToken.data.accessToken,
        // });
        // setAccount(auth.data.numbers.ach[0]);
        // console.log(account);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        let accounts = await axios.get("api/accounts/" + user._id);
        console.log(accounts);
      } catch (err) {
        console.log(err);
      }
    }
    fetchTransactions();
  }, []);

  return <span>{account ? account.account : ""}</span>;
};

export default Auth;
