import React from "react";

const Login = () => {
  function google() {
    window.open("https://financeme-rwlo.onrender.com/auth/google", "_self");
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={google}>login</button>
    </div>
  );
};

export default Login;
