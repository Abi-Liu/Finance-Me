const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./passport");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

require("dotenv").config({ path: "./config/.env" });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "https://finance-me.netlify.app/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

//connect database
connectDB();

app.use(
  cookieSession({
    name: "session",
    keys: ["FinanceMe"],
    maxAge: 30 * 24 * 60 * 60 * 100,
  })
);

//sessions
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log("server has started");
});
