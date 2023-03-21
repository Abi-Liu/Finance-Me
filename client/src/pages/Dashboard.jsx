import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import Auth from "../components/Auth";

axios.defaults.baseURL = "http://localhost:8000";

const Dashboard = ({ user }) => {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();

  //creating link token to plaid api
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("api/create_link_token");
      setLinkToken(response.data.link_token);
    }
    fetch();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      console.log("success", public_token, metadata);
      // send public_token to server
    },
  });

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
      {publicToken && <Auth publicToken={publicToken} user={user} />}
    </div>
  );
};

export default Dashboard;
