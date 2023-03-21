import { useState, useEffect } from "react";
import axios from "axios";

const Auth = ({ publicToken, user }) => {
  const [account, setAccount] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        let accessToken = await axios.post("api/exchange_public_token", {
          public_token: publicToken,
        });
        // console.log(accessToken)

        const auth = await axios.post("api/auth", {
          access_token: accessToken.data.accessToken,
        });
        setAccount(auth.data.numbers.ach[0]);
        // console.log(account.account)
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return <span>{account ? account.account : ""}</span>;
};

export default Auth;
