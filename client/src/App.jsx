import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/auth/login/success", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      {/* <Navbar user = {user}/> */}
      <Routes>
        <Route
          path="/"
          element={!user ? <Home /> : <Navigate to="/dashboard" />}
        ></Route>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        ></Route>
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
